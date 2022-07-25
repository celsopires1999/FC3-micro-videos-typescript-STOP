import { NotFoundError } from "#seedwork/domain";
import { Category } from "#category/domain";
import { CategoryInMemoryRepository } from "#category/infra";
import { DeleteCategoryUseCase } from "#category/application";

describe("DeleteCategoryUseCase Unit Tests", () => {
  let repository: CategoryInMemoryRepository;
  let useCase: DeleteCategoryUseCase.UseCase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });
  it("should throw an error when id is not found", async () => {
    await expect(useCase.execute({ id: "fake-id" })).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake-id")
    );
  });

  it("should delete category", async () => {
    const spyUpdate = jest.spyOn(repository, "delete");
    const entity = new Category({ name: "Movie" });
    repository.items = [entity];

    await useCase.execute({ id: entity.id });
    expect(repository.items).toHaveLength(0);
    expect(spyUpdate).toHaveBeenCalledTimes(1);
  });
});
