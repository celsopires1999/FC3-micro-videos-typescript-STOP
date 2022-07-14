import { CategorySequelize } from "#category/infra";
import { setupSequelize } from "#seedwork/infra";
import { ListCategoriesUseCase } from "#category/application";
import _chance from "chance";

const chance = _chance();

const { CategoryModel, CategoryRepository } = CategorySequelize;

setupSequelize({ models: [CategoryModel] });

let repository: CategorySequelize.CategoryRepository;
let useCase: ListCategoriesUseCase.UseCase;

beforeEach(() => {
  repository = new CategoryRepository(CategoryModel);
  useCase = new ListCategoriesUseCase.UseCase(repository);
});

describe("ListCategoriesUseCase Integration Tests", () => {
  it("should return output with two categories ordered by created_at when input is empty", async () => {
    const created_at = new Date();
    const defaultProps = {
      description: null,
      is_active: true,
    };

    const categoriesProps = [
      {
        id: chance.guid({ version: 4 }),
        name: "category1",
        created_at: created_at,
        ...defaultProps,
      },
      {
        id: chance.guid({ version: 4 }),
        name: "category2",
        created_at: new Date(created_at.getTime() + 100),
        ...defaultProps,
      },
    ];

    const models = await CategoryModel.bulkCreate(categoriesProps);

    const output = await useCase.execute({});

    const { CategoryModelMapper } = CategorySequelize;
    expect(output).toMatchObject({
      items: [
        CategoryModelMapper.toEntity(models[1]).toJSON(),
        CategoryModelMapper.toEntity(models[0]).toJSON(),
      ],
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output with three categories ordered by created_at when input is empty", async () => {
    const models = await CategoryModel.factory()
      .count(3)
      .bulkCreate((index: number) => {
        return {
          id: chance.guid({ version: 4 }),
          name: `test ${index}`,
          description: "some description",
          is_active: true,
          created_at: new Date(new Date().getTime() + index),
        };
      });

    const output = await useCase.execute({});

    const { CategoryModelMapper } = CategorySequelize;
    expect(output).toMatchObject({
      items: [...models]
        .reverse()
        .map(CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output using paginate, sort and filter", async () => {
    const models = CategoryModel.factory().count(5).bulkMake();
    models[0].name = "a";
    models[1].name = "AAA";
    models[2].name = "AaA";
    models[3].name = "b";
    models[4].name = "c";

    await CategoryModel.bulkCreate(models.map((m) => m.toJSON()));

    const { CategoryModelMapper } = CategorySequelize;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toMatchObject({
      items: [models[1], models[2]]
        .map(CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toMatchObject({
      items: [models[0]]
        .map(CategoryModelMapper.toEntity)
        .map((m) => m.toJSON()),
      total: 3,
      current_page: 2,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });
    expect(output).toMatchObject({
      items: [models[0], models[2]]
        .map(CategoryModelMapper.toEntity)
        .map((m) => m.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });
  });
});
