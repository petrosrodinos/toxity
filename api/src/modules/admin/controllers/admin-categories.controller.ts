import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { AuthRoles } from '@/modules/auth/interfaces/auth.interface';
import { AdminTaxonomyService } from '../services/admin-taxonomy.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@ApiTags('Admin — Categories')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRoles.ADMIN)
@Controller('admin/categories')
export class AdminCategoriesController {
    constructor(private readonly adminTaxonomyService: AdminTaxonomyService) {}

    @Post()
    @ApiOperation({ summary: 'Create a category' })
    create(@Body() dto: CreateCategoryDto) {
        return this.adminTaxonomyService.createCategory(dto);
    }

    @Patch(':uuid')
    @ApiOperation({ summary: 'Update a category' })
    @ApiParam({ name: 'uuid', description: 'Category UUID' })
    update(@Param('uuid') category_uuid: string, @Body() dto: UpdateCategoryDto) {
        return this.adminTaxonomyService.updateCategory(category_uuid, dto);
    }

    @Delete(':uuid')
    @ApiOperation({ summary: 'Delete a category' })
    @ApiParam({ name: 'uuid', description: 'Category UUID' })
    remove(@Param('uuid') category_uuid: string) {
        return this.adminTaxonomyService.removeCategory(category_uuid);
    }
}
