import { CategoryId } from "#category/domain";
import { EntityValidationError } from "#seedwork/domain";
import Genre from "./../genre";

describe("Genre Integration Tests", () => {
  describe("constructor", () => {
    it("should throw an error when name is invalid", () => {
      expect(() => new Genre({ name: null } as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => new Genre({ name: "" } as any)).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => new Genre({ name: 5 as any } as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(
        () => new Genre({ name: "t".repeat(256) } as any)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    describe("should throw an error when categories_id is invalid", () => {
      const arrange = [
        {
          categories_id: null,
          message: {
            categories_id: [
              "categories_id should not be empty",
              "each value in categories_id must be an instance of CategoryId",
            ],
          },
        },
        {
          categories_id: undefined,
          message: {
            categories_id: [
              "categories_id should not be empty",
              "each value in categories_id must be an instance of CategoryId",
            ],
          },
        },
        {
          categories_id: [],
          message: {
            categories_id: ["categories_id should not be empty"],
          },
        },
        {
          categories_id: [1],
          message: {
            categories_id: [
              "each value in categories_id must be an instance of CategoryId",
            ],
          },
        },
        {
          categories_id: [
            new CategoryId("f7228909-0664-49c6-a44f-75436ecbf129"),
            new CategoryId("f7228909-0664-49c6-a44f-75436ecbf129"),
          ],
          message: {
            categories_id: ["categories_id should not have repeated values"],
          },
        },
        {
          categories_id: new Map([
            [1, new CategoryId("f7228909-0664-49c6-a44f-75436ecbf129")],
            [2, new CategoryId("f7228909-0664-49c6-a44f-75436ecbf129")],
          ]),
          message: {
            categories_id: ["categories_id should not have repeated values"],
          },
        },
      ];
      test.each(arrange)(
        "when categories_id is $categories_id",
        ({ categories_id, message }) => {
          expect(
            () => new Genre({ categories_id } as any)
          ).containsErrorMessages(message);
        }
      );
    });

    it("should create genre with valid attributes", () => {
      expect.assertions(0);
      const categoryId = new CategoryId();
      const categoriesId = new Map<string, CategoryId>([
        [categoryId.value, categoryId],
      ]);
      new Genre({ name: "Action", categories_id: categoriesId });
      new Genre({
        name: "Action",
        categories_id: categoriesId,
        created_at: new Date(),
      });
      new Genre({
        name: "Action",
        categories_id: categoriesId,
        is_active: false,
        created_at: new Date(),
      });

      const categoryId1 = new CategoryId();
      const categoryId2 = new CategoryId();

      new Genre({
        name: "Action",
        categories_id: new Map([
          [categoryId1.value, categoryId1],
          [categoryId2.value, categoryId2],
        ]),
      });
    });
  });

  describe("create method", () => {
    it("should throw an error when create command is invalid", () => {
      try {
        Genre.create({ name: "", categories_id: [] });
        fail("Should throw entity validation error");
      } catch (e) {
        if (e instanceof EntityValidationError) {
          expect(e.error).toEqual({
            name: ["name should not be empty"],
            categories_id: ["categories_id should not be empty"],
          });
        } else {
          fail("Should throw entity validation error");
        }
      }
    });

    it("should create a genre", () => {
      expect.assertions(0);
      const categoryId = new CategoryId();
      Genre.create({ name: "Terror", categories_id: [categoryId.value] });
      Genre.create({
        name: "Terror",
        categories_id: [categoryId.value],
        is_active: false,
      });
      Genre.create({
        name: "Terror",
        categories_id: [categoryId.value],
        is_active: false,
        created_at: new Date(),
      });
    });
  });

  describe("update method", () => {
    it("should throw an error when name is invalid", () => {
      const genre = Genre.fake().aGenre().build();
      expect(() => genre.update(null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => genre.update("")).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => genre.update(5 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => genre.update("t".repeat(256))).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should update a genre with valid properties", () => {
      expect.assertions(0);
      const genre = Genre.fake().aGenre().build();
      genre.update("other name");
    });
  });

  describe("addCategoryId method", () => {
    it("should throw an error when category id is invalid", () => {
      const genre = Genre.fake().aGenre().build();
      expect(() => genre.addCategoryId("fake" as any)).containsErrorMessages({
        categories_id: [
          "each value in categories_id must be an instance of CategoryId",
        ],
      });
      expect(genre.categories_id.size).toBe(1);
    });

    it("should not add a duplicate category id", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.addCategoryId(categoryId);
      expect(genre.categories_id.size).toBe(1);
    });

    it("should add a category id", () => {
      const genre = Genre.fake().aGenre().build();
      const categoryId = new CategoryId();
      genre.addCategoryId(categoryId);
      expect(genre.categories_id.size).toBe(2);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });
  });

  describe("removeCategoryId method", () => {
    it("should throw an error when categories_id has just one id", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      expect(() => genre.removeCategoryId(categoryId)).containsErrorMessages({
        categories_id: ["categories_id should not be empty"],
      });
      expect(genre.categories_id.size).toBe(1);
    });

    it("should discard removal attempt when category id does not exist", () => {
      const genre = Genre.fake().aGenre().build();
      const otherCategoryId = new CategoryId();
      genre.removeCategoryId(otherCategoryId);
      expect(genre.categories_id.size).toBe(1);
    });
  });

  describe("updateCategoriesId method", () => {
    it("should discard update when argument is not an array", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.updateCategoriesId("fake id" as any);
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });

    it("should discard update when argument is an empty array", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.updateCategoriesId([]);
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });

    it("should throw an error when argument is an invalid category id", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      expect(() =>
        genre.updateCategoriesId(["fake"] as any)
      ).containsErrorMessages({
        categories_id: [
          "each value in categories_id must be an instance of CategoryId",
        ],
      });
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });

    it("should update categories id", () => {
      const categoryId = new CategoryId();
      const categoriesId = [new CategoryId(), new CategoryId()];
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.updateCategoriesId(categoriesId);
      expect(genre.categories_id.size).toBe(2);
      expect(genre.categories_id.get(categoryId.value)).toBeUndefined();
      expect(genre.categories_id.get(categoriesId[0].value)).toEqual(
        categoriesId[0]
      );
      expect(genre.categories_id.get(categoriesId[1].value)).toEqual(
        categoriesId[1]
      );
    });

    it("should discard duplicated categories id on updating", () => {
      const categoryId = new CategoryId();
      const categoriesId = [categoryId, categoryId, categoryId];
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.updateCategoriesId(categoriesId);
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });
  });

  describe("syncCategoriesId method", () => {
    it("should sync categories id", () => {
      const categoryId = new CategoryId();
      const categoriesId = [new CategoryId(), new CategoryId()];
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.syncCategories(categoriesId);
      expect(genre.categories_id.size).toBe(2);
      expect(genre.categories_id.get(categoryId.value)).toBeUndefined();
      expect(genre.categories_id.get(categoriesId[0].value)).toEqual(
        categoriesId[0]
      );
      expect(genre.categories_id.get(categoriesId[1].value)).toEqual(
        categoriesId[1]
      );
    });
  });
});
