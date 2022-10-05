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
    describe('should create a category', () => {
      const arrange = CategoryFixture.arrangeForSave();
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);
          const keysInResponse = CategoryFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(keysInResponse);
          const category = await categoryRepo.findById(res.body.id);

          const presenter = CategoriesController.categoryToResponse(
            category.toJSON(),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body).toMatchObject(serialized);
          expect(res.body).toStrictEqual({
            id: res.body.id,
            created_at: res.body.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
