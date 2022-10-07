import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CategoriesController } from '../../src/categories/categories.controller';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixture } from '../../src/categories/fixtures';
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
  let app: INestApplication;
  let categoryRepo: CategoryRepository.Repository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    categoryRepo = moduleFixture.get<CategoryRepository.Repository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );

    app = moduleFixture.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
  });

  describe('POST / categories', () => {
    describe('should give a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const arrange = CategoryFixture.arrangeInvalidRequest();
      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(app.app.getHttpServer())
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
      const arrange = CategoryFixture.arrangeForEntityValidationError();
      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });
  });

  describe('should create a category', () => {
    const app = startApp();
    const arrange = CategoryFixture.arrangeForSave();
    beforeEach(() => {
      categoryRepo = app.app.get<CategoryRepository.Repository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
    });
    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const res = await request(app.app.getHttpServer())
          .post('/categories')
          .send(send_data)
          .expect(201);
        const keysInResponse = CategoryFixture.keysInResponse();
        expect(Object.keys(res.body)).toStrictEqual(['data']);
        expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
        const id = res.body.data.id;
        const category = await categoryRepo.findById(id);

        const presenter = CategoriesController.categoryToResponse(
          category.toJSON(),
        );
        const serialized = instanceToPlain(presenter);
        expect(res.body.data).toMatchObject(serialized);
        expect(res.body.data).toStrictEqual({
          id: serialized.id,
          created_at: serialized.created_at,
          ...expected,
        });
      },
    );
  });
});
