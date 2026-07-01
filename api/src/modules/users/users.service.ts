import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { to_public_user, PublicUser } from '@/modules/auth/utils/user.utils';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async get_profile(user_uuid: string): Promise<PublicUser> {
        const user = await this.prisma.user.findUnique({
            where: { uuid: user_uuid },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return to_public_user(user);
    }

    async update_profile(user_uuid: string, dto: UpdateUserDto): Promise<PublicUser> {
        const user = await this.prisma.user.findUnique({
            where: { uuid: user_uuid },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const updated = await this.prisma.user.update({
            where: { uuid: user_uuid },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
            },
        });

        return to_public_user(updated);
    }
}
