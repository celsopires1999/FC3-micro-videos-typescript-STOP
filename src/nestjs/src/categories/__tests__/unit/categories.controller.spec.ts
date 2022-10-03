import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import { CategoriesController } from './../../categories.controller';
import { CreateCategoryDto } from './../../dto/create-category.dto';
import { UpdateCategoryDto } from './../../dto/update-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './../../presenter/category.presenter';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const output: CreateCategoryUseCase.Output = {
      id: '312cffad-1938-489e-a706-643dc9a3cfd3',
      name: 'new category',
      description: 'new description',
      is_active: true,
      created_at: new Date(),
    };

    const expectedPresenter = new CategoryPresenter(output);

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedPresenter)),
    };

    //@ts-expect-error mock for testing
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateCategoryDto = {
      name: 'new category',
      description: 'new description',
      is_active: true,
    };

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(expectedPresenter);
  });

  it('should update a category', async () => {
    const id = '312cffad-1938-489e-a706-643dc9a3cfd3';
    const output: UpdateCategoryUseCase.Output = {
      id,
      name: 'updated category',
      description: 'updated description',
      is_active: true,
      created_at: new Date(),
    };

    const expectedPresenter = new CategoryPresenter(output);

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedPresenter)),
    };

    //@ts-expect-error mock for testing
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateCategoryDto = {
      name: 'updated category',
      description: 'updated description',
      is_active: true,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(expectedPresenter);
  });

  it('should delete a category', async () => {
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(undefined)),
    };

    //@ts-expect-error mock for testing
    controller['deleteUseCase'] = mockDeleteUseCase;

    const id = '312cffad-1938-489e-a706-643dc9a3cfd3';
    expect(controller.remove(id)).toBeInstanceOf(Promise);

    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toBeUndefined();
  });

  it('should list a category', async () => {
    const id = '312cffad-1938-489e-a706-643dc9a3cfd3';
    const output: GetCategoryUseCase.Output = {
      id,
      name: 'some category',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const expectedPresenter = new CategoryPresenter(output);

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedPresenter)),
    };

    //@ts-expect-error mock for testing
    controller['getUseCase'] = mockGetUseCase;

    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toStrictEqual(expectedPresenter);
  });

  it('should list all categories', async () => {
    const id = '312cffad-1938-489e-a706-643dc9a3cfd3';
    const output: ListCategoriesUseCase.Output = {
      items: [
        {
          id,
          name: 'category 1',
          description: 'description 1',
          is_active: true,
          created_at: new Date(),
        },
      ],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 1,
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error mock for testing
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };

    const presenter = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(presenter).toStrictEqual(new CategoryCollectionPresenter(output));
  });
});
