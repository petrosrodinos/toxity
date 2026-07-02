import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ScansService } from './scans.service';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { CreateScanDto } from './dto/create-scan.dto';
import {
    RecentScansQuerySchema,
    RecentScansQueryType,
    ScanQuerySchema,
    ScanQueryType,
} from './dto/scan-query.schema';
import { ScanEntity } from './entities/scan.entity';

@ApiTags('Scans')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('scans')
export class ScansController {
    constructor(private readonly scans_service: ScansService) {}

    @Post()
    @ApiOperation({ summary: 'Record a product scan' })
    @ApiResponse({ status: 201, type: ScanEntity })
    create(
        @CurrentUser('uuid') user_uuid: string,
        @Body() dto: CreateScanDto,
    ) {
        return this.scans_service.create(user_uuid, dto);
    }

    @Get('recent')
    @ApiOperation({ summary: 'Get recent scans for home feed' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiResponse({ status: 200, type: [ScanEntity] })
    find_recent(
        @CurrentUser('uuid') user_uuid: string,
        @Query(new ZodValidationPipe(RecentScansQuerySchema))
        query: RecentScansQueryType,
    ) {
        return this.scans_service.find_recent(user_uuid, query);
    }

    @Get()
    @ApiOperation({ summary: 'List user scan history' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiResponse({ status: 200, type: [ScanEntity] })
    find_all(
        @CurrentUser('uuid') user_uuid: string,
        @Query(new ZodValidationPipe(ScanQuerySchema)) query: ScanQueryType,
    ) {
        return this.scans_service.find_all(user_uuid, query);
    }
}
