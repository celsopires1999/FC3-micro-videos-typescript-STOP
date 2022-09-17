import { CategoryFakeBuilder } from "../category-fake-builder";
import { Chance } from "chance";
import { UniqueEntityId } from "#seedwork/domain";

describe("CategoryFakeBuilder Unit Tests", () => {
  describe("unique_entity_id prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be undefined", () => {
      expect(faker["unique_entity_id"]).toBeUndefined();
    });

    test("withUniqueEntityId", () => {
      const uniqueEntityId = new UniqueEntityId();
      const $this = faker.withUniqueEntityId(uniqueEntityId);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["unique_entity_id"]).toBe(uniqueEntityId);

      faker.withUniqueEntityId(() => uniqueEntityId);
      expect(faker["unique_entity_id"]()).toBe(uniqueEntityId);

      const category = faker.build();
      expect(category.uniqueEntityId).toStrictEqual(uniqueEntityId);
    });

    it("should pass index to unique_entity_id factory", () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      faker.withUniqueEntityId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledWith(0);

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withUniqueEntityId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledWith(0);
      expect(mockFactory).toHaveBeenCalledWith(1);
    });
  });

  describe("name prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be a function", () => {
      expect(typeof faker["name"] === "function").toBeTruthy();
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
      expect(faker["name"]).toBe("test name");
      faker.withName(() => "test name");
      // @ts-expect-error This expression is not callable
      expect(faker["name"]()).toBe("test name");
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

      expect(faker["name"]).toBeUndefined();

      faker.withInvalidNameEmpty(null);
      expect(faker["name"]).toBeNull();

      faker.withInvalidNameEmpty("");
      expect(faker["name"]).toBe("");
    });

    test("invalid not a string case", () => {
      const $this = faker.withInvalidNameNotAString();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);

      expect(faker["name"]).toBe(5);

      faker.withInvalidNameNotAString(55);
      expect(faker["name"]).toBe(55);

      faker.withInvalidNameNotAString(true);
      expect(faker["name"]).toBeTruthy();
    });

    test("invalid too long case", () => {
      const tooLong = "t".repeat(256);

      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["name"].length).toBe(256);

      faker.withInvalidNameTooLong(tooLong);
      expect(faker["name"].length).toBe(256);
      expect(faker["name"]).toBe(tooLong);
    });
  });

  describe("description prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be a function", () => {
      expect(typeof faker["description"] === "function").toBeTruthy();
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
      expect(faker["description"]).toBeNull();
      faker.withDescription("test description");
      expect(faker["description"]).toBe("test description");
      faker.withDescription(() => "test description");
      // @ts-expect-error This expression is not callable
      expect(faker["description"]()).toBe("test description");
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
      expect(faker["description"]).toBe(5);

      faker.withInvalidDescriptionNotAString(55);
      expect(faker["description"]).toBe(55);

      faker.withInvalidDescriptionNotAString(true);
      expect(faker["description"]).toBeTruthy();
    });
  });

  describe("is_active prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be a function", () => {
      expect(typeof faker["is_active"] === "function").toBeTruthy();
    });

    test("activate", () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["is_active"]).toBeTruthy();
    });

    test("deactivate", () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["is_active"]).toBeFalsy();
    });

    test("invalid empty case", () => {
      const $this = faker.withInvalidIsActiveEmpty(undefined);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["is_active"]).toBeUndefined();

      faker.withInvalidIsActiveEmpty(null);
      expect(faker["is_active"]).toBeNull();

      faker.withInvalidIsActiveEmpty("");
      expect(faker["is_active"]).toBe("");
    });

    test("invalid not a boolean case", () => {
      const $this = faker.withInvalidIsActiveNotABoolean();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["is_active"]).toBe("fake boolean");

      faker.withInvalidIsActiveNotABoolean(5);
      expect(faker["is_active"]).toBe(5);
    });
  });

  describe("created_at prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be undefined", () => {
      expect(faker["created_at"]).toBeUndefined();
    });

    test("withCreatedAt", () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["created_at"]).toBe(date);

      faker.withCreatedAt(() => date);
      expect(faker["created_at"]()).toBe(date);
    });

    it("should pass index to created_at factory", () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();
      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 0 + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 1 + 2);
    });
  });
});
