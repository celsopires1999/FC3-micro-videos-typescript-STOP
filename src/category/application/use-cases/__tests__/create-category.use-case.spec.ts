import CreateCategoryUseCase from "../create-category.use-case";
import InMememoryCategoryRepository from "../../../infra/repository/category-in-memory.repository";
import { EntityValidationError } from "../../../../@seedwork/domain/errors/validation-error";

describe("CreateCategoryUseCase Unit Tests", () => {
  let repository: InMememoryCategoryRepository;
  let useCase: CreateCategoryUseCase;

  beforeEach(() => {
    repository = new InMememoryCategoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });
  it("should create category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    let output = await useCase.execute({ name: "Test" });
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "Test",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
    expect(spyInsert).toHaveBeenCalledTimes(1);

    output = await useCase.execute({
      name: "Test",
      description: "some description",
      is_active: false,
    });
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: "Test",
      description: "some description",
      is_active: false,
      created_at: repository.items[1].created_at,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
  });

  it("should throw an error when create category without name", async () => {
    expect(useCase.execute({ name: "" })).rejects.toThrow(
      "Entity Validation Error"
    );

    expect(useCase.execute({ name: "" })).rejects.toThrowError(
      EntityValidationError
    );
  });
});
