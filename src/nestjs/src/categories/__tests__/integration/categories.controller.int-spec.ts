import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CategorySequelize } from '@fc/micro-videos/category/infra';
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
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: { name: 'Movie', description: null },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: { name: 'Movie', is_active: true },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: { name: 'Movie', is_active: false },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: false,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'A good movie',
          is_active: true,
        },
        expectedPresenter: {
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
        expectedPresenter: {
          name: 'Movie',
          description: 'A good movie',
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedPresenter }) => {
        const presenter = await controller.create(request);
        const entity = await repository.findById(presenter.id);

        expect(entity).toMatchObject({
          id: presenter.id,
          name: expectedPresenter.name,
          description: expectedPresenter.description,
          is_active: expectedPresenter.is_active,
          created_at: presenter.created_at,
        });

        expect(presenter.id).toBe(entity.id);
        expect(presenter.name).toBe(expectedPresenter.name);
        expect(presenter.description).toBe(expectedPresenter.description);
        expect(presenter.is_active).toBe(expectedPresenter.is_active);
        expect(presenter.created_at).toStrictEqual(entity.created_at);
      },
    );
  });
  describe('should update a category', () => {
    const defaultProps = {
      id: '37ebfe50-8a89-42d3-9d89-2af4a72e5d58',
      name: 'initial',
      description: 'initial',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const arrange = [
      {
        categoryProps: { ...defaultProps },
        request: { name: 'Movie' },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        categoryProps: { ...defaultProps, is_active: false },
        request: { name: 'Movie', description: null },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: false,
        },
      },
      {
        categoryProps: { ...defaultProps, is_active: false },
        request: { name: 'Movie', is_active: true },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        categoryProps: { ...defaultProps, is_active: true },
        request: { name: 'Movie', is_active: true },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        categoryProps: { ...defaultProps },
        request: {
          name: 'Movie',
          description: 'A good movie',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'A good movie',
          is_active: true,
        },
      },
      {
        categoryProps: { ...defaultProps },
        request: {
          name: 'Movie',
          description: 'A good movie',
          is_active: false,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'A good movie',
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ categoryProps, request, expectedPresenter }) => {
        const model = await CategorySequelize.CategoryModel.create(
          categoryProps,
        );
        const presenter = await controller.update(model.id, request);
        const entity = await repository.findById(presenter.id);

        expect(entity).toMatchObject({
          id: presenter.id,
          name: expectedPresenter.name,
          description: expectedPresenter.description,
          is_active: expectedPresenter.is_active,
          created_at: presenter.created_at,
        });

        expect(presenter.id).toBe(entity.id);
        expect(presenter.name).toBe(expectedPresenter.name);
        expect(presenter.description).toBe(expectedPresenter.description);
        expect(presenter.is_active).toBe(expectedPresenter.is_active);
        expect(presenter.created_at).toStrictEqual(entity.created_at);
      },
    );
  });
});
