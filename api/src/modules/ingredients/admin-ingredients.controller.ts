import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { IngredientEntity } from './entities/ingredient.entity';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { AuthRoles } from '@/modules/auth/interfaces/auth.interface';

@ApiTags('Admin — Ingredients')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRoles.ADMIN)
@Controller('admin/ingredients')
export class AdminIngredientsController {
    constructor(private readonly ingredients_service: IngredientsService) {}

    @Post()
    @ApiOperation({ summary: 'Create ingredient (admin seeding)' })
    @ApiResponse({ status: 201, type: IngredientEntity })
    create(@Body() dto: CreateIngredientDto) {
        return this.ingredients_service.create(dto);
    }
}
