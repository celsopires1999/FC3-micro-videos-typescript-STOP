import { CreateCategoryUseCase } from "../create-category.use-case";
import InMememoryCategoryRepository from "../../../infra/db/in-memory/category-in-memory.repository";
import { EntityValidationError } from "../../../../@seedwork/domain/errors/validation-error";
import CategoryExistsError from "#category/domain/errors/category-exists.error";

describe("CreateCategoryUseCase Unit Tests", () => {
  let repository: InMememoryCategoryRepository;
  let useCase: CreateCategoryUseCase.UseCase;

  beforeEach(() => {
    repository = new InMememoryCategoryRepository();
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
