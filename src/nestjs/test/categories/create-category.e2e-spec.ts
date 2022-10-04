import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixture } from '../../src/categories/fixtures';

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
          expect(res.body.id).toBe(category.id);
          expect(res.body.created_at).toBe(category.created_at.toISOString());
          expect(res.body).toMatchObject({
            name: category.name,
            description: category.description,
            is_active: category.is_active,
          });
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
