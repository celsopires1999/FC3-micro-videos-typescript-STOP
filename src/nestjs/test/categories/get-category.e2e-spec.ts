import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { getConnectionToken } from '@nestjs/sequelize';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CategoriesController } from '../../src/categories/categories.controller';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixture } from '../../src/categories/fixtures';

describe('CategoriesController (e2e)', () => {
  describe('/categories:id (GET)', () => {
    const nestApp = startApp();
    describe('should give a response error with 422/404 when id is invalid or not found', () => {
      const arrange = [
        {
          label: 'INVALID',
          id: 'fake id',
          expected: {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: 'Validation failed (uuid v4 is expected)',
          },
        },
        {
          label: 'NOT FOUND',
          id: 'd0ba5077-fb6d-406f-bd05-8c521ba9425a',
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'Entity not found using ID d0ba5077-fb6d-406f-bd05-8c521ba9425a',
          },
        },
      ];
      test.each(arrange)('id contents: $label', ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should get a category', async () => {
      const categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const sequelize = nestApp.app.get(getConnectionToken());
      await sequelize.sync({ force: true });

      const createdCategory = Category.fake().aCategory().build();
      categoryRepo.insert(createdCategory);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/categories/${createdCategory.id}`)
        .expect(200);
      const keysInResponse = CategoryFixture.keysInResponse();
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

      const presenter = CategoriesController.categoryToResponse(
        createdCategory.toJSON(),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
