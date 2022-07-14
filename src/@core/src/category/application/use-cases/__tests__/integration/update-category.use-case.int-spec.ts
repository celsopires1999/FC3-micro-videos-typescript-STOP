import { CategorySequelize } from "#category/infra";
import { NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra";
import { UpdateCategoryUseCase } from "#category/application";

const { CategoryModel, CategoryRepository } = CategorySequelize;
setupSequelize({ models: [CategoryModel] });

let repository: CategorySequelize.CategoryRepository;
let useCase: UpdateCategoryUseCase.UseCase;

beforeEach(() => {
  repository = new CategoryRepository(CategoryModel);
  useCase = new UpdateCategoryUseCase.UseCase(repository);
});

describe("UpdateCategoryUseCase Integration Tests", () => {
  it("should throw an error on update when category is not found", async () => {
    await expect(
      useCase.execute({
        id: "fake id",
        name: "fake name",
      })
    ).rejects.toThrowError(
      new NotFoundError("Entity not found using ID fake id")
    );
  });

  it("should update category", async () => {
    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: string | null;
        is_active?: boolean | null;
      };
      expected: {
        id: string;
        name: string;
        description: string;
        is_active: boolean;
        created_at: Date;
      };
    };

    const model = await CategoryModel.factory().create();

    const arrange: Arrange[] = [
      {
        input: {
          id: model.id,
          name: "Test",
          description: "some description",
        },
        expected: {
          id: model.id,
          name: "Test",
          description: "some description",
          is_active: true,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "Test",
          is_active: false,
        },
        expected: {
          id: model.id,
          name: "Test",
          description: null,
          is_active: false,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "Test",
        },
        expected: {
          id: model.id,
          name: "Test",
          description: null,
          is_active: false,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "Test",
          is_active: true,
        },
        expected: {
          id: model.id,
          name: "Test",
          description: null,
          is_active: true,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "Test",
        },
        expected: {
          id: model.id,
          name: "Test",
          description: null,
          is_active: true,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "Test",
          description: "some description",
        },
        expected: {
          id: model.id,
          name: "Test",
          description: "some description",
          is_active: true,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "Test",
          description: "some description",
          is_active: false,
        },
        expected: {
          id: model.id,
          name: "Test",
          description: "some description",
          is_active: false,
          created_at: model.created_at,
        },
      },
    ];

    let output = await useCase.execute({ id: model.id, name: "Test" });
    expect(output).toStrictEqual({
      id: model.id,
      name: "Test",
      description: null,
      is_active: true,
      created_at: model.created_at,
    });

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        name: i.input.name,
        description: i.input.description,
        is_active: i.input.is_active,
      });
      expect(output).toStrictEqual({
        id: model.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });
});
