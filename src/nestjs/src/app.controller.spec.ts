import { ConfigService } from '@nestjs/config';
import { ConfigModule, CONFIG_SCHEMA_TYPE } from './config/config.module';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(__dirname, 'envs/.env.testing'),
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);

    const configService: ConfigService =
      app.get<ConfigService<CONFIG_SCHEMA_TYPE>>(ConfigService);

    const db_vendor =
      configService.get<CONFIG_SCHEMA_TYPE['DB_VENDOR']>('DB_VENDOR');

    console.log(db_vendor);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
