import CreateCategoryUseCase from "../create-category.use-case";
import GetCategoryUseCase from "../get-category.use-case";
import InMememoryCategoryRepository from "../../../infra/repository/category-in-memory.repository";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";

describe("GetCategoryUseCase Unit Tests", () => {
  it("should throw an error when id is not found", async () => {
    const repository = new InMememoryCategoryRepository();
    const getCategory = new GetCategoryUseCase(repository);

    expect(
      getCategory.execute({
        id: "fake-id",
      })
    ).rejects.toThrow(new NotFoundError("Entity not found using ID fake-id"));
  });

  it("should get a category", async () => {
    const repository = new InMememoryCategoryRepository();

    const createCategory = new CreateCategoryUseCase(repository);
    const outputCreateCategory = await createCategory.execute({ name: "Test" });

    const getCategory = new GetCategoryUseCase(repository);
    const outputGetCategory = await getCategory.execute({
      id: outputCreateCategory.id,
    });

    expect(outputCreateCategory).toStrictEqual(outputGetCategory);
  });
});
