import { CategorySequelize } from "#category/infra";
import { setupSequelize } from "#seedwork/infra";
import { GetCategoryUseCase } from "#category/application";
import { NotFoundError } from "#seedwork/domain";

const { CategoryModel, CategoryRepository } = CategorySequelize;

setupSequelize({ models: [CategoryModel] });

let repositoy: CategorySequelize.CategoryRepository;
let useCase: GetCategoryUseCase.UseCase;

beforeEach(() => {
  repositoy = new CategoryRepository(CategoryModel);
  useCase = new GetCategoryUseCase.UseCase(repositoy);
});
describe("GetCategoryUseCase Integration Tests", () => {
  it("should throw an error when category not found", async () => {
    await expect(useCase.execute({ id: "fake id" })).rejects.toThrowError(
      new NotFoundError("Entity not found using ID fake id")
    );
  });

  it("should get a category", async () => {
    const model = await CategoryModel.factory().create();
    const output = await useCase.execute({ id: model.id });

    expect(output).toStrictEqual({
      id: model.id,
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
    });
  });
});
