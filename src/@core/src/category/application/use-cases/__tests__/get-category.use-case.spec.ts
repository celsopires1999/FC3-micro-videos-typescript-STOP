import { CreateCategoryUseCase } from "../create-category.use-case";
import { GetCategoryUseCase } from "../get-category.use-case";
import CategoryInMemoryRepository from "../../../infra/db/in-memory/category-in-memory.repository";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";

let repository: CategoryInMemoryRepository;
let useCase: GetCategoryUseCase.UseCase;

beforeEach(() => {
  repository = new CategoryInMemoryRepository();
  useCase = new GetCategoryUseCase.UseCase(repository);
});

describe("GetCategoryUseCase Unit Tests", () => {
  it("should throw an error when id is not found", async () => {
    await expect(useCase.execute({ id: "fake-id" })).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake-id")
    );
  });

  it("should get a category", async () => {
    const createdCategory = await new CreateCategoryUseCase.UseCase(
      repository
    ).execute({ name: "Test" });

    const spyFindById = jest.spyOn(repository, "findById");
    useCase = new GetCategoryUseCase.UseCase(repository);
    const outputUseCase = await useCase.execute({
      id: createdCategory.id,
    });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(outputUseCase).toStrictEqual(createdCategory);
  });
});
