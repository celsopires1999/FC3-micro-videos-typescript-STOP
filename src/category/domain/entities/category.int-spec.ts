import ValidationError from "../../../@seedwork/errors/validation-error";
import Category from "./category";

describe("Category Integration Tests", () => {
  describe("create method", () => {
    it("should throw an error when name is invalid", () => {
      expect(() => new Category({ name: null })).toThrowError(
        new ValidationError("The name is required")
      );

      expect(() => new Category({ name: "" })).toThrowError(
        new ValidationError("The name is required")
      );

      expect(() => new Category({ name: 5 as any })).toThrowError(
        new ValidationError("The name must be a string")
      );

      expect(() => new Category({ name: "t".repeat(256) })).toThrowError(
        new ValidationError(
          "The name must be equal or less than 255 characters"
        )
      );
    });

    it("should throw an error when description is invalid", () => {
      expect(
        () => new Category({ name: "Valid Name", description: 5 as any })
      ).toThrowError(new ValidationError("The description must be a string"));
    });

    it("should throw an error when is_active is invalid", () => {
      expect(
        () => new Category({ name: "Valid Name", is_active: "" as any })
      ).toThrowError(new ValidationError("The is_active must be a boolean"));
    });

    it("should create a category with valid attributes", () => {
      expect.assertions(0);
      new Category({ name: "Movie" }); // NOSONAR
      new Category({ name: "Movie", description: "Movie Description" }); // NOSONAR
      new Category({ name: "Movie", description: null }); // NOSONAR
      new Category({ name: "Movie", created_at: new Date() }); // NOSONAR
      /* NOSONAR */ new Category({
        name: "Movie",
        description: "Movie Description",
        is_active: false,
      });
      /* NOSONAR */ new Category({
        name: "Movie",
        description: "Movie Description",
        is_active: true,
      });
    });
  });

  describe("update method", () => {
    it("should throw an error when name is invalid", () => {
      const category = new Category({ name: "Movie" });
      expect(() => category.update(null, null)).toThrowError(
        new ValidationError("The name is required")
      );

      expect(() => category.update("", null)).toThrowError(
        new ValidationError("The name is required")
      );

      expect(() => category.update(5 as any, null)).toThrowError(
        new ValidationError("The name must be a string")
      );

      expect(() => category.update("t".repeat(256), null)).toThrowError(
        new ValidationError(
          "The name must be equal or less than 255 characters"
        )
      );
    });

    it("should update a category with valid properties", () => {
      expect.assertions(0);
      const category = new Category({ name: "Movie" });
      category.update("New Movie", null);
      category.update("New Movie", undefined);
      category.update("New Movie", "New Description");
    });
  });
});
