import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CategorySequelize } from "#category/infra";
import { CreateCategoryUseCase } from "#category/application";

const { CategoryModel, CategoryRepository } = CategorySequelize;

describe("CategorySequelizeRepository Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  let repository: CategorySequelize.CategoryRepository;
  let useCase: CreateCategoryUseCase.UseCase;

  beforeEach(async () => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });

  describe("should create category", () => {
    const arrange = [
      {
        inputProps: { name: "some name" },
        outputProps: {
          name: "some name",
          description: null,
          is_active: true,
        },
      },
      {
        inputProps: { name: "some name", description: "some description" },
        outputProps: {
          name: "some name",
          description: "some description",
          is_active: true,
        },
      },
      {
        inputProps: {
          name: "some name",
          description: "some description",
          is_active: true,
        },
        outputProps: {
          name: "some name",
          description: "some description",
          is_active: true,
        },
      },
      {
        inputProps: {
          name: "some name",
          description: "some description",
          is_active: false,
        },
        outputProps: {
          name: "some name",
          description: "some description",
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      "when input is $inputProps, output is $outputProps",
      async ({ inputProps, outputProps }) => {
        const output = await useCase.execute(inputProps);
        const entity = await repository.findById(output.id);
        expect(entity.id).toBe(output.id);
        expect(entity.created_at).toStrictEqual(output.created_at);
        expect(output).toMatchObject(outputProps);
      }
    );
  });
});
