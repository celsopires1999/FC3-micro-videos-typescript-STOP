import { UpdateCategoryUseCase } from "#category/application";
import { Category } from "#category/domain";
import { CategorySequelize } from "#category/infra";
import { NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

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

    const entity = Category.fake().aCategory().build();
    repository.insert(entity);

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.id,
          name: "Test",
          description: "some description",
        },
        expected: {
          id: entity.id,
          name: "Test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: "Test",
          is_active: false,
        },
        expected: {
          id: entity.id,
          name: "Test",
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: "Test",
        },
        expected: {
          id: entity.id,
          name: "Test",
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: "Test",
          is_active: true,
        },
        expected: {
          id: entity.id,
          name: "Test",
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: "Test",
        },
        expected: {
          id: entity.id,
          name: "Test",
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: "Test",
          description: "some description",
        },
        expected: {
          id: entity.id,
          name: "Test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: "Test",
          description: "some description",
          is_active: false,
        },
        expected: {
          id: entity.id,
          name: "Test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    let output = await useCase.execute({ id: entity.id, name: "Test" });
    expect(output).toStrictEqual({
      id: entity.id,
      name: "Test",
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        name: i.input.name,
        description: i.input.description,
        is_active: i.input.is_active,
      });
      const updatedEntity = await repository.findById(entity.id);

      expect(output).toStrictEqual({
        id: entity.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });

      expect(updatedEntity.toJSON()).toStrictEqual({
        id: entity.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });
});
