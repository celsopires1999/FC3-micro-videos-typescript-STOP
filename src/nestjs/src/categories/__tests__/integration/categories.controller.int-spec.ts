import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';
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
import { CategoryFixture, ListCategoriesFixture } from './../../fixtures';

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
    const arrange = CategoryFixture.arrangeForSave();

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(presenter.id);

        expect(entity.toJSON()).toStrictEqual({
          id: presenter.id,
          created_at: presenter.created_at,
          ...send_data,
          ...expected,
        });

        expect(presenter).toEqual(new CategoryPresenter(entity));
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
    describe('should return presenter with categories ordered by created_at when query is empty', () => {
      const { arrange, entitiesMap } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();
      const entities = Object.values(entitiesMap);

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          await repository.bulkInsert(entities);
          const presenter = await controller.search(send_data);
          expect(presenter).toEqual(new CategoryCollectionPresenter(expected));
        },
      );
    });

    describe('should return output using paginate, sort and filter', () => {
      const { arrange, entitiesMap } = ListCategoriesFixture.arrangeUnsorted();
      const items = Object.values(entitiesMap);

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          await repository.bulkInsert(items);
          const presenter = await controller.search(send_data);
          expect(presenter).toEqual(new CategoryCollectionPresenter(expected));
        },
      );
    });
  });
});
