import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesModule } from './../../../categories/categories.module';
import { ConfigModule } from './../../../config/config.module';
import { DatabaseModule } from './../../../database/database.module';
import { CategoriesController } from './../../categories.controller';
import { CATEGORY_PROVIDERS } from './../../category.providers';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_SEQUELIZE_REPOSITORY.provide,
    );
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
  });

  describe('should create a category', () => {
    const arrange = [
      {
        request: { name: 'Movie' },
        expectedOutput: { name: 'Movie', description: null, is_active: true },
      },
      {
        request: { name: 'Movie', description: null },
        expectedOutput: { name: 'Movie', description: null, is_active: true },
      },
      {
        request: { name: 'Movie', is_active: true },
        expectedOutput: { name: 'Movie', description: null, is_active: true },
      },
      {
        request: { name: 'Movie', is_active: false },
        expectedOutput: { name: 'Movie', description: null, is_active: false },
      },
      {
        request: {
          name: 'Movie',
          description: 'A good movie',
          is_active: true,
        },
        expectedOutput: {
          name: 'Movie',
          description: 'A good movie',
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'A good movie',
          is_active: false,
        },
        expectedOutput: {
          name: 'Movie',
          description: 'A good movie',
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedOutput }) => {
        const output = await controller.create(request);
        const entity = await repository.findById(output.id);

        expect(entity).toMatchObject({
          id: output.id,
          name: expectedOutput.name,
          description: expectedOutput.description,
          is_active: expectedOutput.is_active,
          created_at: output.created_at,
        });

        expect(output.id).toBe(entity.id);
        expect(output.name).toBe(expectedOutput.name);
        expect(output.description).toBe(expectedOutput.description);
        expect(output.is_active).toBe(expectedOutput.is_active);
        expect(output.created_at).toStrictEqual(entity.created_at);
      },
    );
  });
});
