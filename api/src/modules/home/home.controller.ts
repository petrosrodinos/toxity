import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { HomeFeedEntity } from './entities/home.entity';

@ApiTags('Home')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) {}

    @Get()
    @ApiOperation({ summary: 'Get aggregated home feed sections' })
    @ApiResponse({ status: 200, type: HomeFeedEntity })
    getHomeFeed(@CurrentUser('uuid') user_uuid: string) {
        return this.homeService.getHomeFeed(user_uuid);
    }
}
