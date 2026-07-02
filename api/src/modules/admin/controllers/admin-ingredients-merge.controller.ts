import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { AuthRoles } from '@/modules/auth/interfaces/auth.interface';
import { AdminModerationService } from '../services/admin-moderation.service';
import { MergeEntitiesDto } from '../dto/merge-entities.dto';

@ApiTags('Admin — Ingredients')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRoles.ADMIN)
@Controller('admin/ingredients')
export class AdminIngredientsMergeController {
    constructor(private readonly adminModerationService: AdminModerationService) {}

    @Post('merge')
    @ApiOperation({ summary: 'Merge two duplicate ingredients' })
    merge(@Body() dto: MergeEntitiesDto) {
        return this.adminModerationService.mergeIngredients(dto);
    }
}
