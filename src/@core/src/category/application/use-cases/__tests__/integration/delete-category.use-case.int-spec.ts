import { CategorySequelize } from "#category/infra";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { DeleteCategoryUseCase } from "#category/application";
import { NotFoundError } from "#seedwork/domain";
import { Category } from "#category/domain";

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
      new NotFoundError("fake Id", Category)
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
