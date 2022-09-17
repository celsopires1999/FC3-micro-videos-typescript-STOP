import { CategoryFakeBuilder } from "../category-fake-builder";
import { Chance } from "chance";

describe("CategoryFakeBuilder Unit Tests", () => {
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
      faker.withName("test name");
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
      faker.withDescription(null);
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
  });

  describe("is_active prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be a function", () => {
      expect(typeof faker["is_active"] === "function").toBeTruthy();
    });

    test("activate", () => {
      faker.activate();
      expect(faker["is_active"]).toBeTruthy();
    });

    test("deactivate", () => {
      faker.deactivate();
      expect(faker["is_active"]).toBeFalsy();
    });
  });
});
