import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileEntity } from './entities/user-profile.entity';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly users_service: UsersService) {}

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, type: UserProfileEntity })
    get_me(@CurrentUser('uuid') user_uuid: string) {
        return this.users_service.get_profile(user_uuid);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, type: UserProfileEntity })
    update_me(
        @CurrentUser('uuid') user_uuid: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.users_service.update_profile(user_uuid, dto);
    }
}
