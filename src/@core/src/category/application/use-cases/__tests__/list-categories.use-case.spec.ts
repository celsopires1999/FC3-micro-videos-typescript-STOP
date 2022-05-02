import { ListCategoriesUseCase } from "../list-categories.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import { CategoryRepository } from "../../../domain/repository/category.repository";
import Category from "../../../domain/entities/category";

let repository: CategoryInMemoryRepository;
let useCase: ListCategoriesUseCase.UseCase;

beforeEach(() => {
  repository = new CategoryInMemoryRepository();
  useCase = new ListCategoriesUseCase.UseCase(repository);
});

describe("ListCategoriesUseCase Unit Tests", () => {
  test("toOutput method", () => {
    let result = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    let output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });

    const entity = new Category({ name: "Movie" });
    result = new CategoryRepository.SearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });
  });

  it("should return output with two categories ordered by created_at when input is empty", async () => {
    const created_at = new Date();
    const entity1 = new Category({
      name: "category1",
      created_at,
    });
    const entity2 = new Category({
      name: "category2",
      created_at: new Date(created_at.getTime() + 100),
    });

    repository.items = [entity1, entity2];

    const output = await useCase.execute({});

    expect(output).toStrictEqual({
      items: [entity2.toJSON(), entity1.toJSON()],
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output with three categories ordered by created_at when input is empty", async () => {
    const items = [
      new Category({ name: "teste 1" }),
      new Category({
        name: "teste 2",
        created_at: new Date(new Date().getTime() + 100),
      }),
      new Category({
        name: "teste 3",
        created_at: new Date(new Date().getTime() + 200),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output using paginate, sort and filter", async () => {
    const items = [
      new Category({ name: "a" }),
      new Category({ name: "AAA" }),
      new Category({ name: "AaA" }),
      new Category({ name: "b" }),
      new Category({ name: "c" }),
    ];
    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
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
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
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
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });
  });
});
