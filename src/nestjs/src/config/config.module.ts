import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModue,
  ConfigModuleOptions,
} from '@nestjs/config';
import { join } from 'path';

@Module({})
export class ConfigModule extends NestConfigModue {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return super.forRoot({
      envFilePath: [
        ...(Array.isArray(options.envFilePath)
          ? options.envFilePath
          : [options.envFilePath]),
        join(__dirname, '../envs/.env'),
      ],
    });
  }
}
