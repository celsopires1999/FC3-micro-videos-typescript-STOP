import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CategoriesController } from '../../src/categories/categories.controller';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { UpdateCategoryFixture } from '../../src/categories/fixtures';
import { applyGlobalConfig } from '../../src/global-config';

function startApp({
  beforeInit,
}: { beforeInit?: (app: INestApplication) => void } = {}) {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    _app = moduleFixture.createNestApplication();
    applyGlobalConfig(_app);
    beforeInit && beforeInit(_app);
    await _app.init();
  });

  return {
    get app() {
      return _app;
    },
  };
}

describe('CategoriesController (e2e)', () => {
  const uuid = '4b1f1c5e-67d8-4142-a286-fae0b1d6032a';

  describe('PUT / categories:id', () => {
    describe('should give a response error with 422 when request body is invalid', () => {
      const nestApp = startApp();
      const arrange = UpdateCategoryFixture.arrangeInvalidRequest();
      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(nestApp.app.getHttpServer())
          .put(`/categories/${uuid}`)
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should give a response error with 422 when throw EntityValidationError', () => {
      const nestApp = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });
      const arrange = UpdateCategoryFixture.arrangeForEntityValidationError();
      let categoryRepo: CategoryRepository.Repository;

      beforeEach(() => {
        categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });

      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        const category = Category.fake().aCategory().build();
        categoryRepo.insert(category);
        return request(nestApp.app.getHttpServer())
          .put(`/categories/${category.id}`)
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should give a response error with 422/404 when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Category.fake().aCategory();
      const arrange = [
        {
          label: 'INVALID',
          id: 'fake id',
          send_data: { name: faker.name },
          expected: {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: 'Validation failed (uuid v4 is expected)',
          },
        },
        {
          label: 'NOT FOUND',
          id: 'd0ba5077-fb6d-406f-bd05-8c521ba9425a',
          send_data: { name: faker.name },
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'Entity not found using ID d0ba5077-fb6d-406f-bd05-8c521ba9425a',
          },
        },
      ];
      test.each(arrange)(
        'id contents: $label',
        ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .put(`/categories/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should update a category', () => {
      const nestApp = startApp();
      const arrange = UpdateCategoryFixture.arrangeForSave();
      let categoryRepo: CategoryRepository.Repository;
      beforeEach(() => {
        categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const createdCategory = Category.fake().aCategory().build();
          categoryRepo.insert(createdCategory);
          const res = await request(nestApp.app.getHttpServer())
            .put(`/categories/${createdCategory.id}`)
            .send(send_data)
            .expect(200);
          const keysInResponse = UpdateCategoryFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.id;
          const updatedCategory = await categoryRepo.findById(id);

          const presenter = CategoriesController.categoryToResponse(
            updatedCategory.toJSON(),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toMatchObject(serialized);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...send_data,
            ...expected,
          });
        },
      );
    });
  });
});
