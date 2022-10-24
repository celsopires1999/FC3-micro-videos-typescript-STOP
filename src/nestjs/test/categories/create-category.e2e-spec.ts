import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { getConnectionToken } from '@nestjs/sequelize';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CategoriesController } from '../../src/categories/categories.controller';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CreateCategoryFixture } from '../../src/categories/fixtures';

describe('CategoriesController (e2e)', () => {
  describe('POST / categories', () => {
    describe('should give a response error with 422 when request body is invalid', () => {
      const nestApp = startApp();
      const arrange = CreateCategoryFixture.arrangeInvalidRequest();
      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(nestApp.app.getHttpServer())
          .post('/categories')
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should give a response error with 422 when throw EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });
      const arrange = CreateCategoryFixture.arrangeForEntityValidationError();
      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should create a category', () => {
      const nestApp = startApp();
      const arrange = CreateCategoryFixture.arrangeForSave();
      let categoryRepo: CategoryRepository.Repository;

      beforeEach(async () => {
        const sequelize = nestApp.app.get(getConnectionToken());
        await sequelize.sync({ force: true });
        categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(nestApp.app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);
          const keysInResponse = CreateCategoryFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.id;
          const category = await categoryRepo.findById(id);

          const presenter = CategoriesController.categoryToResponse(
            category.toJSON(),
          );
          const serialized = instanceToPlain(presenter);
          // expect(res.body.data).toMatchObject(serialized);
          expect(res.body.data).toMatchObject({
            id: serialized.id,
            // created_at: serialized.created_at,
            ...send_data,
            ...expected,
          });
        },
      );
    });
  });
});
