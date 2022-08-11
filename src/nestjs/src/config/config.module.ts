import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';
import { join } from 'path';
import Joi from 'joi';

const DB_SCHEMA = Joi.object({
  DB_VENDOR: Joi.string().required().valid('mysql', 'sqlite'),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PORT: Joi.number().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_LOGGING: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
});

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const { envFilePath, ...otherOptions } = options;

    return super.forRoot({
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath]),
        join(__dirname, `../envs/.env.${process.env.NODE_ENV}`),
        join(__dirname, '../envs/.env'),
      ],
      validationSchema: DB_SCHEMA,
      ...otherOptions,
    });
  }
}
