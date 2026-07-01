import { Body, Controller, Post } from '@nestjs/common';
import { EmailAuthService } from '../services/email.service';
import { RegisterEmailDto } from '../dto/register-email.dto';
import { LoginEmailDto } from '../dto/login-email.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { AuthResponse } from '../entities/auth-response.entity';
import { WaitlistDto } from '../dto/waitlist.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/password-reset.dto';

@ApiTags('Email Authentication')
@Controller('auth/email')
export class EmailAuthController {
    constructor(private readonly auth_service: EmailAuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user with email and password' })
    @ApiBody({ type: RegisterEmailDto })
    @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponse })
    @ApiResponse({ status: 409, description: 'Conflict - User with this email already exists' })
    registerWithEmail(@Body() dto: RegisterEmailDto) {
        return this.auth_service.registerWithEmail(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user with email and password' })
    @ApiBody({ type: LoginEmailDto })
    @ApiResponse({ status: 200, description: 'User logged in successfully', type: AuthResponse })
    loginWithEmail(@Body() dto: LoginEmailDto) {
        return this.auth_service.loginWithEmail(dto);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset email' })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({ status: 200, description: 'Reset email sent if account exists' })
    forgot_password(@Body() dto: ForgotPasswordDto) {
        return this.auth_service.forgot_password(dto);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password with token from email' })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    reset_password(@Body() dto: ResetPasswordDto) {
        return this.auth_service.reset_password(dto);
    }

    @Post('waitlist')
    @ApiOperation({ summary: 'Waitlist a user with ref code' })
    @ApiBody({ type: WaitlistDto })
    @ApiResponse({ status: 200, description: 'User added to waitlist' })
    waitlist(@Body() dto: WaitlistDto) {
        return this.auth_service.waitlist(dto);
    }
}
