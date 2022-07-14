import { CreateCategoryUseCase } from "#category/application";
import { CategoryInMemoryRepository } from "#category/infra";
import { EntityValidationError } from "#seedwork/domain";
import { CategoryExistsError } from "#category/domain/";

describe("CreateCategoryUseCase Unit Tests", () => {
  let repository: CategoryInMemoryRepository;
  let useCase: CreateCategoryUseCase.UseCase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });
  it("should create category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    let output = await useCase.execute({ name: "Test 1" });
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "Test 1",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
    expect(spyInsert).toHaveBeenCalledTimes(1);

    output = await useCase.execute({
      name: "Test 2",
      description: "some description",
      is_active: false,
    });
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: "Test 2",
      description: "some description",
      is_active: false,
      created_at: repository.items[1].created_at,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
  });

  it("should throw an error when create category without name", async () => {
    await expect(useCase.execute({ name: "" })).rejects.toThrow(
      "Entity Validation Error"
    );

    await expect(useCase.execute({ name: "" })).rejects.toThrowError(
      EntityValidationError
    );
  });

  it("should throw an error when a category exists already", async () => {
    await useCase.execute({ name: "category 1" });
    await expect(useCase.execute({ name: "category 1" })).rejects.toThrowError(
      new CategoryExistsError(
        "category 1 exists already in the categories collection"
      )
    );
  });
});
