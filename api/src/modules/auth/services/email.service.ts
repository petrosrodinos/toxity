import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterEmailDto } from '../dto/register-email.dto';
import { LoginEmailDto } from '../dto/login-email.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/password-reset.dto';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateJwtService } from '@/shared/utils/jwt/jwt.service';
import { AuthRoles } from '../interfaces/auth.interface';
import { WaitlistDto } from '../dto/waitlist.dto';
import { SendgridMailService } from '@/integrations/notifications/sendgrid/services/mail.service';
import { EmailConfig } from '@/shared/constants/email';
import {
    generate_lookup_token,
    parse_lookup_token,
    hash_token,
    verify_token,
    token_expires_at,
} from '../utils/token.utils';
import { to_public_user, PublicUser } from '../utils/user.utils';

export interface AuthResponse {
    access_token: string;
    expires_in: number;
    user: PublicUser;
}

@Injectable()
export class EmailAuthService {
    private readonly logger = new Logger(EmailAuthService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt_service: CreateJwtService,
        private readonly mail_service: SendgridMailService,
        private readonly config: ConfigService,
    ) {}

    async registerWithEmail(dto: RegisterEmailDto): Promise<AuthResponse> {
        const existing_user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existing_user) {
            throw new ConflictException('User with this email already exists');
        }

        const hashed_password = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashed_password,
                role: AuthRoles.USER,
            },
        });

        const access_token = await this.jwt_service.signToken({
            uuid: user.uuid,
            role: user.role,
        });
        const expires_in = this.jwt_service.getExpirationTime(access_token);

        return {
            access_token,
            expires_in,
            user: to_public_user(user),
        };
    }

    async loginWithEmail(dto: LoginEmailDto): Promise<AuthResponse> {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const password_match = await bcrypt.compare(dto.password, user.password);

        if (!password_match) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const access_token = await this.jwt_service.signToken({
            uuid: user.uuid,
            role: user.role,
        });
        const expires_in = this.jwt_service.getExpirationTime(access_token);

        return {
            access_token,
            expires_in,
            user: to_public_user(user),
        };
    }

    async forgot_password(dto: ForgotPasswordDto): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            return { message: 'If an account exists, a reset email has been sent' };
        }

        setImmediate(async () => {
            try {
                await this.send_password_reset_email(user.uuid, user.email);
            } catch (error) {
                this.logger.error('Failed to send password reset email', error);
            }
        });

        return { message: 'If an account exists, a reset email has been sent' };
    }

    async reset_password(dto: ResetPasswordDto): Promise<{ message: string }> {
        const parsed = parse_lookup_token(dto.token);

        if (!parsed) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const stored = await this.prisma.passwordResetToken.findFirst({
            where: {
                uuid: parsed.lookup_id,
                expires_at: { gt: new Date() },
            },
            include: { user: true },
        });

        if (!stored) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const is_match = await verify_token(dto.token, stored.token_hash);

        if (!is_match) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const hashed_password = await bcrypt.hash(dto.password, 10);

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { uuid: stored.user_uuid },
                data: { password: hashed_password },
            }),
            this.prisma.passwordResetToken.deleteMany({
                where: { user_uuid: stored.user_uuid },
            }),
        ]);

        return { message: 'Password reset successfully' };
    }

    async waitlist(dto: WaitlistDto) {
        const existing_user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existing_user) {
            return { message: 'You are already in the waitlist', code: 'WAITLIST_ALREADY_EXISTS' };
        }

        await this.prisma.user.create({
            data: {
                email: dto.email,
                password: '',
                role: AuthRoles.USER,
            },
        });

        await this.mail_service.sendEmail({
            to: dto.email,
            from: EmailConfig.email_addresses.alert,
            subject: EmailConfig.templates.waitlist.subject,
            template_id: EmailConfig.templates.waitlist.template_id,
        });

        return { message: 'You have been successfully added to the waitlist', code: 'WAITLIST_SUCCESS' };
    }

    private async send_password_reset_email(user_uuid: string, email: string): Promise<void> {
        await this.prisma.passwordResetToken.deleteMany({
            where: { user_uuid },
        });

        const { lookup_id, plain_token } = generate_lookup_token();
        const token_hash = await hash_token(plain_token);

        await this.prisma.passwordResetToken.create({
            data: {
                uuid: lookup_id,
                user_uuid,
                token_hash,
                expires_at: token_expires_at(1),
            },
        });

        const app_url = this.config.get<string>('APP_URL') ?? 'http://localhost:5173';
        const reset_url = `${app_url}/auth/reset-password?token=${encodeURIComponent(plain_token)}`;

        await this.mail_service.sendEmail({
            to: email,
            from: EmailConfig.email_addresses.alert,
            subject: EmailConfig.templates.password_reset.subject,
            template_id: EmailConfig.templates.password_reset.template_id,
            dynamic_template_data: {
                reset_url,
                action_url: reset_url,
            },
        });
    }
}
