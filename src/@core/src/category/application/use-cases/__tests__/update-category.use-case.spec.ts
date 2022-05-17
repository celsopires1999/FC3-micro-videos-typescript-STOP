import { UpdateCategoryUseCase } from "../update-category.use-case";
import InMememoryCategoryRepository from "../../../infra/db/in-memory/category-in-memory.repository";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import Category from "../../../domain/entities/category";

describe("UpdateCategoryUseCase Unit Tests", () => {
  let repository: InMememoryCategoryRepository;
  let useCase: UpdateCategoryUseCase.UseCase;

  beforeEach(() => {
    repository = new InMememoryCategoryRepository();
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });
  it("should throw an error when id is not found", async () => {
    expect(useCase.execute({ id: "fake-id", name: "fake" })).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake-id")
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
    const spyUpdate = jest.spyOn(repository, "update");
    const entity = new Category({ name: "Movie" });
    repository.items = [entity];

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
    expect(spyUpdate).toHaveBeenCalledTimes(1);

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        name: i.input.name,
        description: i.input.description,
        is_active: i.input.is_active,
      });
      expect(output).toStrictEqual({
        id: entity.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });
});
