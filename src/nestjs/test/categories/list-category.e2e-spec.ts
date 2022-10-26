import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { ListCategoriesFixture } from '../../src/categories/fixtures';
import { CategoryCollectionPresenter } from '../../src/categories/presenter/category.presenter';

describe('CategoriesController (e2e)', () => {
  describe('/categories (GET)', () => {
    describe('should return categories ordered by created_at when query is empty', () => {
      let categoryRepo: CategoryRepository.Repository;
      const nestApp = startApp();
      const { arrange, entitiesMap } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();
      const entities = Object.values(entitiesMap);

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await categoryRepo.bulkInsert(entities);
      });

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          const res = await request(nestApp.app.getHttpServer())
            .get(`/categories?${queryParams}`)
            .expect(200);
          expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
          const presenter = new CategoryCollectionPresenter(expected);
          const serialized = instanceToPlain(presenter);
          expect(res.body).toEqual(serialized);
        },
      );
    });

    describe('should return categories using paginate, sort and filter', () => {
      let categoryRepo: CategoryRepository.Repository;
      const nestApp = startApp();
      const { arrange, entitiesMap } = ListCategoriesFixture.arrangeUnsorted();
      const entities = Object.values(entitiesMap);

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await categoryRepo.bulkInsert(entities);
      });

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          const res = await request(nestApp.app.getHttpServer())
            .get(`/categories?${queryParams}`)
            .expect(200);
          expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
          const presenter = new CategoryCollectionPresenter(expected);
          const serialized = instanceToPlain(presenter);
          expect(res.body).toEqual(serialized);
        },
      );
    });
  });
});
