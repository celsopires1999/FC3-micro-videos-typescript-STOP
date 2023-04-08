import { CategoryId } from "#category/domain";
import { Chance } from "chance";
import { GenreId } from "../genre";
import { GenreFakeBuilder } from "../genre-fake-builder";

describe("GenreFakeBuilder Unit Tests", () => {
  describe("entity_id prop", () => {
    const faker = GenreFakeBuilder.aGenre();

    it("should throw an error when entity_id has not been set", () => {
      expect(() => faker["getValue"]("entity_id")).toThrow(
        new Error(
          `Property entity_id does not have a factory, use "with" method instead`
        )
      );
      expect(() => faker.entity_id).toThrow(
        new Error(
          `Property entity_id does not have a factory, use "with" method instead`
        )
      );
    });

    it("should be undefined", () => {
      expect(faker["_entity_id"]).toBeUndefined();
    });

    test("withEntityId", () => {
      const genreId = new GenreId();
      const $this = faker.withEntityId(genreId);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_entity_id"]).toBe(genreId);

      faker.withEntityId(() => genreId);
      expect(faker["_entity_id"]()).toBe(genreId);

      expect(faker.entity_id).toBe(genreId);

      const genre = faker.build();
      expect(genre.entityId).toStrictEqual(genreId);
    });

    it("should pass index to unique_entity_id factory", () => {
      let mockFactory = jest.fn().mockReturnValue(new GenreId());
      faker.withEntityId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledWith(0);

      mockFactory = jest.fn().mockReturnValue(new GenreId());
      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withEntityId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledWith(0);
      expect(mockFactory).toHaveBeenCalledWith(1);
    });
  });

  describe("name prop", () => {
    const faker = GenreFakeBuilder.aGenre();

    it("should be a function", () => {
      expect(typeof faker["_name"] === "function").toBeTruthy();
    });

    it("should call the word method", () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test("withName", () => {
      const $this = faker.withName("test name");
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_name"]).toBe("test name");
      faker.withName(() => "test name");
      // @ts-expect-error This expression is not callable
      expect(faker["_name"]()).toBe("test name");

      expect(faker.name).toBe("test name");
    });

    it("should pass an index to name factory", () => {
      faker.withName((index) => `test name ${index}`);
      const category = faker.build();
      expect(category.name).toBe(`test name 0`);

      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withName((index) => `test name ${index}`);
      const genres = fakerMany.build();

      expect(genres[0].name).toBe(`test name 0`);
      expect(genres[1].name).toBe(`test name 1`);
    });

    test("invalid empty case", () => {
      const $this = faker.withInvalidNameEmpty(undefined);
      expect($this).toBeInstanceOf(GenreFakeBuilder);

      expect(faker["_name"]).toBeUndefined();

      faker.withInvalidNameEmpty(null);
      expect(faker["_name"]).toBeNull();

      faker.withInvalidNameEmpty("");
      expect(faker["_name"]).toBe("");
    });

    test("invalid not a string case", () => {
      const $this = faker.withInvalidNameNotAString();
      expect($this).toBeInstanceOf(GenreFakeBuilder);

      expect(faker["_name"]).toBe(5);

      faker.withInvalidNameNotAString(55);
      expect(faker["_name"]).toBe(55);

      faker.withInvalidNameNotAString(true);
      expect(faker["_name"]).toBeTruthy();
    });

    test("invalid too long case", () => {
      const tooLong = "t".repeat(256);

      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_name"].length).toBe(256);

      faker.withInvalidNameTooLong(tooLong);
      expect(faker["_name"].length).toBe(256);
      expect(faker["_name"]).toBe(tooLong);
    });
  });

  describe("categories_id prop", () => {
    const faker = GenreFakeBuilder.aGenre();

    it("should be an array", () => {
      expect(faker["_categories_id"]).toBeInstanceOf(Array);
    });

    it("should be empty", () => {
      expect(faker["_categories_id"]).toHaveLength(0);
    });

    test("withCategoryId", () => {
      const categoryId1 = new CategoryId();
      const $this = faker.withCategoryId(categoryId1);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_categories_id"]).toEqual([categoryId1]);
      expect(faker.categories_id).toEqual([categoryId1]);

      const categoryId2 = new CategoryId();
      faker.withCategoryId(() => categoryId2);

      expect([
        faker["_categories_id"][0],
        //@ts-expect-error _categories_id is callable
        faker["_categories_id"][1](),
      ]).toStrictEqual([categoryId1, categoryId2]);
    });

    it("should pass an index to categories_id factory", () => {
      const categoriesId = [new CategoryId(), new CategoryId()];

      faker.withCategoryId((index) => categoriesId[index]);
      const genre = faker.build();
      expect(genre.categories_id.get(categoriesId[0].value)).toEqual(
        categoriesId[0]
      );

      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withCategoryId((index) => categoriesId[index]);
      const genres = fakerMany.build();

      expect(genres[0].categories_id.get(categoriesId[0].value)).toEqual(
        categoriesId[0]
      );
      expect(genres[1].categories_id.get(categoriesId[1].value)).toEqual(
        categoriesId[1]
      );
    });

    test("invalid category id", () => {
      const faker = GenreFakeBuilder.aGenre();
      const $this = faker.withInvalidCategoryId();
      expect($this).toBeInstanceOf(GenreFakeBuilder);

      expect(faker["_categories_id"]).toEqual(["fake id"]);
    });
  });

  describe("is_active prop", () => {
    const faker = GenreFakeBuilder.aGenre();

    it("should be a function", () => {
      expect(typeof faker["_is_active"] === "function").toBeTruthy();
    });

    test("activate", () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_is_active"]).toBeTruthy();
      expect(faker.is_active).toBeTruthy();
    });

    test("deactivate", () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_is_active"]).toBeFalsy();
      expect(faker.is_active).toBeFalsy();
    });
  });

  describe("created_at prop", () => {
    const faker = GenreFakeBuilder.aGenre();
    it("should throw an error when created_at has not been set", () => {
      expect(() => faker["getValue"]("created_at")).toThrow(
        new Error(
          `Property created_at does not have a factory, use "with" method instead`
        )
      );
      expect(() => faker.created_at).toThrow(
        new Error(
          `Property created_at does not have a factory, use "with" method instead`
        )
      );
    });

    it("should be undefined", () => {
      expect(faker["_created_at"]).toBeUndefined();
    });

    test("withCreatedAt", () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_created_at"]).toBe(date);

      faker.withCreatedAt(() => date);
      expect(faker["_created_at"]()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    it("should pass index to created_at factory", () => {
      const date = new Date();
      faker.withCreatedAt(
        (index) => new Date(date.getTime() + (index + 2) * 1000)
      );
      const genre = faker.build();
      expect(genre.created_at.getTime()).toBe(date.getTime() + 2 * 1000);

      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withCreatedAt(
        (index) => new Date(date.getTime() + (index + 2) * 1000)
      );
      const genres = fakerMany.build();
      expect(genres[0].created_at.getTime()).toBe(
        date.getTime() + (0 + 2) * 1000
      );
      expect(genres[1].created_at.getTime()).toBe(
        date.getTime() + (1 + 2) * 1000
      );
    });

    it("should create a genre", () => {
      let faker = GenreFakeBuilder.aGenre();
      let genre = faker.build();

      expect(genre.entityId).toBeInstanceOf(GenreId);
      expect(typeof genre.name === "string").toBeTruthy();
      expect(genre.categories_id).toBeInstanceOf(Map);
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.values().next().value).toBeInstanceOf(
        CategoryId
      );
      expect(genre.is_active).toBeTruthy();
      expect(genre.created_at).toBeInstanceOf(Date);

      const created_at = new Date();
      const genreId = new GenreId();
      const categoryId1 = new CategoryId();
      const categoryId2 = new CategoryId();
      faker = GenreFakeBuilder.aGenre();
      genre = faker
        .withEntityId(genreId)
        .withName("some name")
        .withCategoryId(categoryId1)
        .withCategoryId(categoryId2)
        .deactivate()
        .withCreatedAt(created_at)
        .build();

      expect(genre.entityId.value).toBe(genreId.value);
      expect(genre.id).toBe(genreId.value);
      expect(genre.name).toBe("some name");
      expect(genre.categories_id.get(categoryId1.value)).toEqual(categoryId1);
      expect(genre.categories_id.get(categoryId2.value)).toEqual(categoryId2);
      expect(genre.is_active).toBeFalsy();
      expect(genre.created_at).toStrictEqual(created_at);
    });

    it("should create many genres", () => {
      const faker = GenreFakeBuilder.theGenres(2);
      let genres = faker.build();

      genres.forEach((genre) => {
        expect(genre.entityId).toBeInstanceOf(GenreId);
        expect(typeof genre.name === "string").toBeTruthy();
        expect(genre.categories_id).toBeInstanceOf(Map);
        expect(genre.categories_id.size).toBe(1);
        expect(genre.categories_id.values().next().value).toBeInstanceOf(
          CategoryId
        );
        expect(genre.is_active).toBeTruthy();
        expect(genre.created_at).toBeInstanceOf(Date);
      });

      const created_at = new Date();
      const genreId = new GenreId();
      const categoryId1 = new CategoryId();
      const categoryId2 = new CategoryId();
      genres = faker
        .withEntityId(genreId)
        .withName("some name")
        .withCategoryId(categoryId1)
        .withCategoryId(categoryId2)
        .deactivate()
        .withCreatedAt(created_at)
        .build();

      genres.forEach((genre) => {
        expect(genre.entityId.value).toBe(genreId.value);
        expect(genre.id).toBe(genreId.value);
        expect(genre.name).toBe("some name");
        expect(genre.categories_id).toBeInstanceOf(Map);
        expect(genre.categories_id.get(categoryId1.value)).toEqual(categoryId1);
        expect(genre.categories_id.get(categoryId2.value)).toEqual(categoryId2);
        expect(genre.is_active).toBeFalsy();
        expect(genre.created_at).toStrictEqual(created_at);
      });
    });
  });
});
