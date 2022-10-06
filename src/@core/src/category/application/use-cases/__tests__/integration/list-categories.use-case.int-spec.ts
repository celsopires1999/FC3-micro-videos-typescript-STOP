import { ListCategoriesUseCase } from "#category/application";
import { Category } from "#category/domain";
import { CategorySequelize } from "#category/infra";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

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
    const entities = [
      Category.fake().aCategory().withCreatedAt(created_at).build(),
      Category.fake()
        .aCategory()
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
    ];
    repository.bulkInsert(entities);

    const output = await useCase.execute({});

    expect(output).toMatchObject({
      items: [entities[1].toJSON(), entities[0].toJSON()],
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output with three categories ordered by created_at when input is empty", async () => {
    const entities = Category.fake()
      .theCategories(3)
      .withName((index) => `test ${index}`)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build();
    await repository.bulkInsert(entities);

    const output = await useCase.execute({});

    expect(output).toMatchObject({
      items: [...entities].reverse().map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output using paginate, sort and filter", async () => {
    const faker = Category.fake().aCategory();

    const entities = [
      faker.withName("a").build(),
      faker.withName("AAA").build(),
      faker.withName("AaA").build(),
      faker.withName("b").build(),
      faker.withName("c").build(),
    ];
    await repository.bulkInsert(entities);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toMatchObject({
      items: [entities[1], entities[2]].map((i) => i.toJSON()),
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
      items: [entities[0]].map((m) => m.toJSON()),
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
      items: [entities[0], entities[2]].map((m) => m.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });
  });
});
