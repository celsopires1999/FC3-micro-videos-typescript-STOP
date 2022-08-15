import { CategorySequelize } from '@fc/micro-videos/category/infra';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CONFIG_SCHEMA_TYPE } from './../config/config.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (config: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        const models = [CategorySequelize.CategoryModel];

        console.log('DB_VENDOR:', config.get('DB_VENDOR'));
        console.log('DB_HOST:', config.get('DB_HOST'));
        console.log('DB_AUTO_LOAD_MODELS:', config.get('DB_AUTO_LOAD_MODELS'));
        console.log('DB_LOGGING:', config.get('DB_LOGGING'));

        if (config.get('DB_VENDOR') === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: config.get('DB_HOST'),
            models,
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            logging: config.get('DB_LOGGING'),
          };
        }

        // if (config.get('DB_VENDOR') === 'mysql') {
        //   return {
        //     dialect: 'mysql',
        //     host: config.get('DB_HOST'),
        //     port: +config.get('DB_PORT'),
        //     database: config.get('DB_DATABASE'),
        //     username: config.get('DB_USERNAME'),
        //     password: config.get('DB_PASSWORD'),
        //     models,
        //     autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
        //     logging: config.get('DB_LOGGING'),
        //   };
        // }

        throw new Error('Unsupport database config');
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
