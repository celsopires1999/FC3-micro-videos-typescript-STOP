import { CategorySequelize } from "#category/infra";
import { setupSequelize } from "#seedwork/infra";
import { DeleteCategoryUseCase } from "#category/application";
import { NotFoundError } from "#seedwork/domain";

const { CategoryModel, CategoryRepository } = CategorySequelize;

let repository: CategorySequelize.CategoryRepository;
let useCase: DeleteCategoryUseCase.UseCase;

setupSequelize({ models: [CategoryModel] });

beforeEach(() => {
  repository = new CategoryRepository(CategoryModel);
  useCase = new DeleteCategoryUseCase.UseCase(repository);
});

describe("DeleteCategoryUseCase Integration Tests", () => {
  it("should throw an error on delete when category not found", async () => {
    await expect(useCase.execute({ id: "fake Id" })).rejects.toThrowError(
      new NotFoundError("Entity not found using ID fake Id")
    );
  });
  it("should delete a category", async () => {
    const model = await CategoryModel.factory().create();
    let modelsQuantity = await CategoryModel.count();
    expect(modelsQuantity).toBe(1);

    await useCase.execute({ id: model.id });

    modelsQuantity = await CategoryModel.count();
    expect(modelsQuantity).toBe(0);
  });
});
