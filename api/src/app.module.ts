import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './modules/internal/mail/mail.module';
import { SmsModule } from './modules/internal/sms/sms.module';
import { AiModule } from './modules/internal/ai/ai.module';
import { RedisModule } from './core/databases/redis/redis.module';
import { RedisCacheModule } from './modules/internal/redis-cache/redis-cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { ProductsModule } from './modules/products/products.module';
import { ScansModule } from './modules/scans/scans.module';
import { ProductCreationModule } from './modules/product-creation/product-creation.module';
import { HomeModule } from './modules/home/home.module';
import { SearchModule } from './modules/search/search.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReanalysisModule } from './modules/reanalysis/reanalysis.module';
import { ConfigModule } from './shared/config/env/env.module';

@Module({
  imports: [
    ConfigModule,
    MailModule,
    SmsModule,
    AiModule,
    RedisModule,
    RedisCacheModule,
    // GraphQLModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    BrandsModule,
    IngredientsModule,
    ProductsModule,
    ScansModule,
    ProductCreationModule,
    HomeModule,
    SearchModule,
    FavoritesModule,
    AdminModule,
    ReanalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
