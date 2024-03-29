import { Chance } from "chance";
import { CategoryId } from "../category";
import { CategoryFakeBuilder } from "../category-fake-builder";

describe("CategoryFakeBuilder Unit Tests", () => {
  describe("entity_id prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

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
      const categoryId = new CategoryId();
      const $this = faker.withEntityId(categoryId);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_entity_id"]).toBe(categoryId);

      faker.withEntityId(() => categoryId);
      expect(faker["_entity_id"]()).toBe(categoryId);

      expect(faker.entity_id).toBe(categoryId);

      const category = faker.build();
      expect(category.entityId).toStrictEqual(categoryId);
    });

    it("should pass index to entity_id factory", () => {
      let mockFactory = jest.fn().mockReturnValue(new CategoryId());
      faker.withEntityId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledWith(0);

      mockFactory = jest.fn().mockReturnValue(new CategoryId());
      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withEntityId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledWith(0);
      expect(mockFactory).toHaveBeenCalledWith(1);
    });
  });

  describe("name prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

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
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
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

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test("invalid empty case", () => {
      const $this = faker.withInvalidNameEmpty(undefined);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);

      expect(faker["_name"]).toBeUndefined();

      faker.withInvalidNameEmpty(null);
      expect(faker["_name"]).toBeNull();

      faker.withInvalidNameEmpty("");
      expect(faker["_name"]).toBe("");
    });

    test("invalid not a string case", () => {
      const $this = faker.withInvalidNameNotAString();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);

      expect(faker["_name"]).toBe(5);

      faker.withInvalidNameNotAString(55);
      expect(faker["_name"]).toBe(55);

      faker.withInvalidNameNotAString(true);
      expect(faker["_name"]).toBeTruthy();
    });

    test("invalid too long case", () => {
      const tooLong = "t".repeat(256);

      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_name"].length).toBe(256);

      faker.withInvalidNameTooLong(tooLong);
      expect(faker["_name"].length).toBe(256);
      expect(faker["_name"]).toBe(tooLong);
    });
  });

  describe("description prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be a function", () => {
      expect(typeof faker["_description"] === "function").toBeTruthy();
    });

    it("should call the paragraph method", () => {
      const chance = Chance();
      const spyParagraphMethod = jest.spyOn(chance, "paragraph");
      faker["chance"] = chance;
      faker.build();

      expect(spyParagraphMethod).toHaveBeenCalled();
    });

    test("withDescription", () => {
      const $this = faker.withDescription(null);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_description"]).toBeNull();
      faker.withDescription("test description");
      expect(faker["_description"]).toBe("test description");
      faker.withDescription(() => "test description");
      // @ts-expect-error This expression is not callable
      expect(faker["_description"]()).toBe("test description");

      expect(faker.description).toBe("test description");
    });

    it("should pass an index to description factory", () => {
      faker.withDescription((index) => `test description ${index}`);
      const category = faker.build();
      expect(category.description).toBe(`test description 0`);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withDescription((index) => `test description ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].description).toBe(`test description 0`);
      expect(categories[1].description).toBe(`test description 1`);
    });

    test("invalid not a string case", () => {
      const $this = faker.withInvalidDescriptionNotAString();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_description"]).toBe(5);

      faker.withInvalidDescriptionNotAString(55);
      expect(faker["_description"]).toBe(55);

      faker.withInvalidDescriptionNotAString(true);
      expect(faker["_description"]).toBeTruthy();
    });
  });

  describe("is_active prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be a function", () => {
      expect(typeof faker["_is_active"] === "function").toBeTruthy();
    });

    test("activate", () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_is_active"]).toBeTruthy();
      expect(faker.is_active).toBeTruthy();
    });

    test("deactivate", () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_is_active"]).toBeFalsy();
      expect(faker.is_active).toBeFalsy();
    });

    test("invalid empty case", () => {
      const $this = faker.withInvalidIsActiveEmpty(undefined);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_is_active"]).toBeUndefined();

      faker.withInvalidIsActiveEmpty(null);
      expect(faker["_is_active"]).toBeNull();

      faker.withInvalidIsActiveEmpty("");
      expect(faker["_is_active"]).toBe("");
    });

    test("invalid not a boolean case", () => {
      const $this = faker.withInvalidIsActiveNotABoolean();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_is_active"]).toBe("fake boolean");

      faker.withInvalidIsActiveNotABoolean(5);
      expect(faker["_is_active"]).toBe(5);
    });
  });

  describe("created_at prop", () => {
    const faker = CategoryFakeBuilder.aCategory();
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
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
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
      const category = faker.build();
      expect(category.created_at.getTime()).toBe(date.getTime() + 2 * 1000);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withCreatedAt(
        (index) => new Date(date.getTime() + (index + 2) * 1000)
      );
      const categories = fakerMany.build();
      expect(categories[0].created_at.getTime()).toBe(
        date.getTime() + (0 + 2) * 1000
      );
      expect(categories[1].created_at.getTime()).toBe(
        date.getTime() + (1 + 2) * 1000
      );
    });

    it("should create a category", () => {
      let category = CategoryFakeBuilder.aCategory().build();
      expect(category.entityId).toBeInstanceOf(CategoryId);
      expect(typeof category.name === "string").toBeTruthy();
      expect(typeof category.description === "string").toBeTruthy();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);

      const created_at = new Date();
      const entity_id = new CategoryId();
      category = CategoryFakeBuilder.aCategory()
        .withName("some name")
        .withDescription("some description")
        .deactivate()
        .withCreatedAt(created_at)
        .withEntityId(entity_id)
        .build();
      expect(category.entityId).toBe(entity_id);
      expect(category.id).toBe(entity_id.value);
      expect(category.name).toBe("some name");
      expect(category.description).toBe("some description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toStrictEqual(created_at);
    });

    it("should create many categories", () => {
      let categories = CategoryFakeBuilder.theCategories(2).build();

      categories.forEach((category) => {
        expect(category.entityId).toBeInstanceOf(CategoryId);
        expect(typeof category.name === "string").toBeTruthy();
        expect(typeof category.description === "string").toBeTruthy();
        expect(category.is_active).toBeTruthy();
        expect(category.created_at).toBeInstanceOf(Date);
      });

      const created_at = new Date();
      const entity_id = new CategoryId();
      categories = CategoryFakeBuilder.theCategories(2)
        .withName("some name")
        .withDescription("some description")
        .deactivate()
        .withCreatedAt(created_at)
        .withEntityId(entity_id)
        .build();

      categories.forEach((category) => {
        expect(category.entityId).toBe(entity_id);
        expect(category.id).toBe(entity_id.value);
        expect(category.name).toBe("some name");
        expect(category.description).toBe("some description");
        expect(category.is_active).toBeFalsy();
        expect(category.created_at).toStrictEqual(created_at);
      });
    });
  });
});
