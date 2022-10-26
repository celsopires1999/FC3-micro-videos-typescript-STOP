import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';
import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';

describe('CategoriesController (e2e)', () => {
  describe('/categories:id (DELETE)', () => {
    const nestApp = startApp();
    describe('should return a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '51683e7d-0842-4913-a768-f7bb0be5bfcc',
          expected: {
            message:
              'Entity not found using ID 51683e7d-0842-4913-a768-f7bb0be5bfcc',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            message: 'Validation failed (uuid v4 is expected)',
            statusCode: 422,
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('with id is $id', ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .delete(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a category with response status 204 ', async () => {
      const categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = Category.fake().aCategory().build();
      categoryRepo.insert(category);

      await request(nestApp.app.getHttpServer())
        .delete(`/categories/${category.id}`)
        .expect(204);

      await expect(categoryRepo.findById(category.id)).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${category.id}`),
      );
    });
  });
});
