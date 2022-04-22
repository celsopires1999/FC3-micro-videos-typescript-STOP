import CreateCategoryUseCase from "../create-category.use-case";
import GetCategoryUseCase from "../get-category.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";

let repository: CategoryInMemoryRepository;
let useCase: GetCategoryUseCase;

beforeEach(() => {
  repository = new CategoryInMemoryRepository();
  useCase = new GetCategoryUseCase(repository);
});

describe("GetCategoryUseCase Unit Tests", () => {
  it("should throw an error when id is not found", async () => {
    expect(useCase.execute({ id: "fake-id" })).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake-id")
    );
  });

  it("should get a category", async () => {
    const createdCategory = await new CreateCategoryUseCase(repository).execute(
      { name: "Test" }
    );

    const spyFindById = jest.spyOn(repository, "findById");
    useCase = new GetCategoryUseCase(repository);
    const outputUseCase = await useCase.execute({
      id: createdCategory.id,
    });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(outputUseCase).toStrictEqual(createdCategory);
  });
});