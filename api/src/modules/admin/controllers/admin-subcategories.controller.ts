import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { AuthRoles } from '@/modules/auth/interfaces/auth.interface';
import { AdminTaxonomyService } from '../services/admin-taxonomy.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';

@ApiTags('Admin — Subcategories')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRoles.ADMIN)
@Controller('admin/subcategories')
export class AdminSubcategoriesController {
    constructor(private readonly adminTaxonomyService: AdminTaxonomyService) {}

    @Post()
    @ApiOperation({ summary: 'Create a subcategory' })
    create(@Body() dto: CreateSubcategoryDto) {
        return this.adminTaxonomyService.createSubcategory(dto);
    }

    @Patch(':uuid')
    @ApiOperation({ summary: 'Update a subcategory' })
    @ApiParam({ name: 'uuid', description: 'Subcategory UUID' })
    update(
        @Param('uuid') subcategory_uuid: string,
        @Body() dto: UpdateSubcategoryDto,
    ) {
        return this.adminTaxonomyService.updateSubcategory(subcategory_uuid, dto);
    }

    @Delete(':uuid')
    @ApiOperation({ summary: 'Delete a subcategory' })
    @ApiParam({ name: 'uuid', description: 'Subcategory UUID' })
    remove(@Param('uuid') subcategory_uuid: string) {
        return this.adminTaxonomyService.removeSubcategory(subcategory_uuid);
    }
}
