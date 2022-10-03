import {
  NotFoundError,
  SortDirection,
} from '@fc/micro-videos/@seedwork/domain';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesModule } from './../../../categories/categories.module';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './../../../categories/presenter/category.presenter';
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
        request: { name: 'Movie', is_active: true },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
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
        const entity = Category.fake().aCategory().build();
        await repository.insert(entity);
        const presenter = await controller.update(entity.id, request);
        const foundEntity = await repository.findById(presenter.id);

        expect(foundEntity).toMatchObject({
          id: presenter.id,
          name: expectedPresenter.name,
          description: expectedPresenter.description,
          is_active: expectedPresenter.is_active,
          created_at: presenter.created_at,
        });

        expect(presenter.id).toBe(foundEntity.id);
        expect(presenter.name).toBe(expectedPresenter.name);
        expect(presenter.description).toBe(expectedPresenter.description);
        expect(presenter.is_active).toBe(expectedPresenter.is_active);
        expect(presenter.created_at).toStrictEqual(foundEntity.created_at);
      },
    );
  });
  it('should delete a category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);
    const response = await controller.remove(entity.id);
    expect(response).toBeUndefined();
    expect(repository.findById(entity.id)).rejects.toThrowError(
      new NotFoundError(`Entity not found using ID ${entity.id}`),
    );
  });
  it('should find a category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);
    const expectedPresenter = new CategoryPresenter(entity.toJSON());
    const presenter = await controller.findOne(entity.id);
    expect(presenter).toStrictEqual(expectedPresenter);
    expect(presenter.id).toBe(entity.id);
    expect(presenter.name).toBe(expectedPresenter.name);
    expect(presenter.description).toBe(expectedPresenter.description);
    expect(presenter.is_active).toBe(expectedPresenter.is_active);
    expect(presenter.created_at).toStrictEqual(entity.created_at);
  });
  describe('search method', () => {
    it('should return presenter with categories ordered by created_at when query is empty', async () => {
      const entities = Category.fake()
        .theCategories(4)
        .withName((index) => `teste ${index}`)
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .build();

      await repository.bulkInsert(entities);

      const arrange = [
        {
          send_data: {},
          expected: {
            items: [entities[3], entities[2], entities[1], entities[0]],
            total: 4,
            current_page: 1,
            last_page: 1,
            per_page: 15,
          },
        },
        {
          send_data: { per_page: 2 },
          expected: {
            items: [entities[3], entities[2]],
            total: 4,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
        {
          send_data: { page: 2, per_page: 2 },
          expected: {
            items: [entities[1], entities[0]],
            total: 4,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
        {
          send_data: { page: 99, per_page: 2 },
          expected: {
            items: [],
            total: 4,
            current_page: 99,
            last_page: 2,
            per_page: 2,
          },
        },
      ];

      for (const item of arrange) {
        const presenter = await controller.search(item.send_data);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected),
        );
      }
    });

    it('should return output using paginate, sort and filter', async () => {
      const items = [
        Category.fake().aCategory().withName('a').build(),
        Category.fake().aCategory().withName('AAA').build(),
        Category.fake().aCategory().withName('AaA').build(),
        Category.fake().aCategory().withName('b').build(),
        Category.fake().aCategory().withName('c').build(),
      ];
      await repository.bulkInsert(items);

      const arrange = [
        {
          send_data: { page: 1, per_page: 2, sort: 'name', filter: 'a' },
          expected: {
            items: [items[1], items[2]],
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
        {
          send_data: { page: 2, per_page: 2, sort: 'name', filter: 'a' },
          expected: {
            items: [items[0]],
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
        {
          send_data: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [items[0], items[2]],
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
        {
          send_data: {
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [items[1]],
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      ];

      for (const item of arrange) {
        const presenter = await controller.search(item.send_data);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected),
        );
      }
    });
  });
});
