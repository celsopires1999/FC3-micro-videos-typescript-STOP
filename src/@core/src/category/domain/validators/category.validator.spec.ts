import { CategoryProperties } from "../entities/category";
import CategoryValidatorFactory, {
  CategoryRules,
  CategoryValidator,
} from "./category.validator";

describe("CategoryValidator Tests", () => {
  let validator: CategoryValidator;
  beforeEach(() => (validator = CategoryValidatorFactory.create()));

  test("invalidation cases for name field", () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: ["name should not be empty"],
    });

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({
      validator,
      data: { name: "t".repeat(256) },
    }).containsErrorMessages({
      name: ["name must be shorter than or equal to 255 characters"],
    });
  });

  test("invalidation cases for description field", () => {
    expect({
      validator,
      data: { description: 5 as any },
    }).containsErrorMessages({
      description: ["description must be a string"],
    });
  });

  test("invalidation cases for is_active field", () => {
    expect({
      validator,
      data: { is_active: 5 as any },
    }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });

    expect({
      validator,
      data: { is_active: 0 as any },
    }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });

    expect({
      validator,
      data: { is_active: 1 as any },
    }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });

    expect({
      validator,
      data: { is_active: -1 as any },
    }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });

    expect({
      validator,
      data: { is_active: "v" as any },
    }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });
  });

  test("invalidation cases for created_at field", () => {
    expect({
      validator,
      data: { created_at: 5 as any },
    }).containsErrorMessages({
      created_at: ["created_at must be a Date instance"],
    });
  });

  describe("valid cases for fields", () => {
    const arrange: CategoryProperties[] = [
      { name: "some name" },
      { name: "some name", description: undefined },
      { name: "some name", description: null },
      { name: "some name", is_active: undefined },
      { name: "some name", is_active: null },
      { name: "some name", created_at: undefined },
      { name: "some name", created_at: null },
      { name: "some name", description: "some description" },
      { name: "some name", description: "some description", is_active: true },
      { name: "some name", description: "some description", is_active: false },
      {
        name: "some name",
        description: "some description",
        is_active: true,
        created_at: new Date(),
      },
    ];
    test.each(arrange)("validate %# %o", (item) => {
      expect(validator.validate(item)).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item));
      expect(validator.errors).toBeNull;
    });
  });
});
