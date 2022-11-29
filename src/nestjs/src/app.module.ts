import { Module } from '@nestjs/common';
import { ShareModule } from './@share/@share.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CastMembersModule } from './cast-members/cast-members.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    CategoriesModule,
    CastMembersModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    ShareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
