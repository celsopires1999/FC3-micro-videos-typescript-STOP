import { getConnectionToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import * as Joi from 'joi';
import { Sequelize } from 'sequelize-typescript';
import { ConfigModule, CONFIG_DB_SCHEMA } from './../config/config.module';
import { DatabaseModule } from './database.module';

describe('DatabaseModule Unit Tests', () => {
  describe('sqlite connection', () => {
    const connOptions = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: false,
    };

    it('should be valid', () => {
      const schema = Joi.object({
        ...CONFIG_DB_SCHEMA,
      });
      const { error } = schema.validate(connOptions);
      expect(error).toBeUndefined();
    });

    it('should be a sqlite connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connOptions],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const conn = app.get<Sequelize>(getConnectionToken());
      expect(conn).toBeDefined();
      expect(conn.options.dialect).toBe('sqlite');
      expect(conn.options.host).toBe(':memory:');
      expect(conn.options.logging).toBeFalsy();
      //@ts-expect-error type is not correct: autoLoadModels exists in options
      expect(conn.options.autoLoadModels).toBeFalsy();
      await conn.close();
    });
  });
});
