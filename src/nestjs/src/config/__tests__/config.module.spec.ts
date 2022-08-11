import { CONFIG_DB_SCHEMA } from '../config.module';
import Joi from 'joi';

describe('Schema Unit Tests', () => {
  describe('DB Schema', () => {
    const schema = Joi.object({ ...CONFIG_DB_SCHEMA });
    describe('DB_VENDOR', () => {
      test('invalid cases - required', () => {
        expect(schema.validate({}).error.message).toContain(
          `"DB_VENDOR" is required`,
        );
      });

      test('invalid cases - mysql | sqlite', () => {
        expect(schema.validate({ DB_VENDOR: 5 }).error.message).toContain(
          `"DB_VENDOR" must be one of [mysql, sqlite]`,
        );
      });
    });
  });
});
