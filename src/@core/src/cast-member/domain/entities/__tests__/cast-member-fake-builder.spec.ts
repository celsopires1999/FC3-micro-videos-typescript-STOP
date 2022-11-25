import { CastMemberFakeBuilder } from "../cast-member-fake-builder";
import { Chance } from "chance";
import { UniqueEntityId } from "#seedwork/domain";
import CastMemberType from "../cast-member-type.vo";

describe("CastMemberFakeBuilder Unit Tests", () => {
  describe("unique_entity_id prop", () => {
    const faker = CastMemberFakeBuilder.aCastMember();

    it("should throw an error when unique_entity_id has not been set", () => {
      expect(() => faker["getValue"]("unique_entity_id")).toThrow(
        new Error(
          `Property unique_entity_id does not have a factory, use "with" method instead`
        )
      );
      expect(() => faker.unique_entity_id).toThrow(
        new Error(
          `Property unique_entity_id does not have a factory, use "with" method instead`
        )
      );
    });

    it("should be undefined", () => {
      expect(faker["_unique_entity_id"]).toBeUndefined();
    });

    test("withUniqueEntityId", () => {
      const uniqueEntityId = new UniqueEntityId();
      const $this = faker.withUniqueEntityId(uniqueEntityId);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_unique_entity_id"]).toBe(uniqueEntityId);

      faker.withUniqueEntityId(() => uniqueEntityId);
      expect(faker["_unique_entity_id"]()).toBe(uniqueEntityId);

      expect(faker.unique_entity_id).toBe(uniqueEntityId);

      const category = faker.build();
      expect(category.uniqueEntityId).toStrictEqual(uniqueEntityId);
    });

    it("should pass index to unique_entity_id factory", () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      faker.withUniqueEntityId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledWith(0);

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withUniqueEntityId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledWith(0);
      expect(mockFactory).toHaveBeenCalledWith(1);
    });
  });

  describe("name prop", () => {
    const faker = CastMemberFakeBuilder.aCastMember();

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
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
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

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test("invalid empty case", () => {
      const $this = faker.withInvalidNameEmpty(undefined);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);

      expect(faker["_name"]).toBeUndefined();

      faker.withInvalidNameEmpty(null);
      expect(faker["_name"]).toBeNull();

      faker.withInvalidNameEmpty("");
      expect(faker["_name"]).toBe("");
    });

    test("invalid not a string case", () => {
      const $this = faker.withInvalidNameNotAString();
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);

      expect(faker["_name"]).toBe(5);

      faker.withInvalidNameNotAString(55);
      expect(faker["_name"]).toBe(55);

      faker.withInvalidNameNotAString(true);
      expect(faker["_name"]).toBeTruthy();
    });

    test("invalid too long case", () => {
      const tooLong = "t".repeat(256);

      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_name"].length).toBe(256);

      faker.withInvalidNameTooLong(tooLong);
      expect(faker["_name"].length).toBe(256);
      expect(faker["_name"]).toBe(tooLong);
    });
  });

  describe("type prop", () => {
    const faker = CastMemberFakeBuilder.aCastMember();
    it("should be a function", () => {
      expect(typeof faker["_type"] === "function").toBeTruthy();
    });

    it("should call the integer method", () => {
      const chance = Chance();
      const spyIntegerMethod = jest.spyOn(chance, "integer");
      faker["chance"] = chance;
      faker.build();

      expect(spyIntegerMethod).toHaveBeenCalled();
    });

    test("withType", () => {
      const $this = faker.withType(null);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_type"]).toBeNull();

      const actor = CastMemberType.createActor();
      faker.withType(actor);
      expect(faker["_type"]).toEqual(actor);

      faker.withType(() => actor);
      // @ts-expect-error This expression is not callable
      expect(faker["_type"]()).toEqual(actor);

      expect(faker.type).toEqual(actor);
    });

    it("should pass an index to type factory", () => {
      faker.withType((index) =>
        index % 2 === 0
          ? CastMemberType.createDirector()
          : CastMemberType.createActor()
      );
      const castMember = faker.build();
      expect(
        castMember.type.equals(CastMemberType.createDirector())
      ).toBeTruthy();

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withType((index) =>
        index % 2 === 0
          ? CastMemberType.createDirector()
          : CastMemberType.createActor()
      );
      const castMembers = fakerMany.build();

      expect(
        castMembers[0].type.equals(CastMemberType.createDirector())
      ).toBeTruthy();
      expect(
        castMembers[1].type.equals(CastMemberType.createActor())
      ).toBeTruthy();
    });

    test("invalid empty case", () => {
      const $this = faker.withInvalidTypeEmpty(undefined);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_type"]).toBeUndefined();

      faker.withInvalidTypeEmpty(null);
      expect(faker["_type"]).toBeNull();

      faker.withInvalidTypeEmpty("");
      expect(faker["_type"]).toBe("");
    });

    test("invalid not a cast member type case", () => {
      const $this = faker.withInvalidTypeNotACastMemberType();
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_type"]).toBe("fake cast member type");

      faker.withInvalidTypeNotACastMemberType(5);
      expect(faker["_type"]).toBe(5);
    });
  });

  describe("created_at prop", () => {
    const faker = CastMemberFakeBuilder.aCastMember();
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
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
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

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
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

    it("should create a cast member", () => {
      let castMember = CastMemberFakeBuilder.aCastMember().build();
      expect(castMember.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
      expect(typeof castMember.name === "string").toBeTruthy();
      expect(castMember.type).toBeInstanceOf(CastMemberType);
      expect(castMember.created_at).toBeInstanceOf(Date);

      const created_at = new Date();
      const unique_entity_id = new UniqueEntityId();
      castMember = CastMemberFakeBuilder.aCastMember()
        .withName("some name")
        .withType(CastMemberType.createDirector())
        .withCreatedAt(created_at)
        .withUniqueEntityId(unique_entity_id)
        .build();
      expect(castMember.uniqueEntityId).toBe(unique_entity_id);
      expect(castMember.id).toBe(unique_entity_id.value);
      expect(castMember.name).toBe("some name");
      expect(
        castMember.type.equals(CastMemberType.createDirector())
      ).toBeTruthy();
      expect(castMember.created_at).toStrictEqual(created_at);
    });

    it("should create many cast members", () => {
      let castMembers = CastMemberFakeBuilder.theCastMembers(2).build();

      castMembers.forEach((castMember) => {
        expect(castMember.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
        expect(typeof castMember.name === "string").toBeTruthy();
        expect(castMember.type).toBeInstanceOf(CastMemberType);
        expect(castMember.created_at).toBeInstanceOf(Date);
      });

      const created_at = new Date();
      const unique_entity_id = new UniqueEntityId();
      castMembers = CastMemberFakeBuilder.theCastMembers(2)
        .withName("some name")
        .withType(CastMemberType.createActor())
        .withCreatedAt(created_at)
        .withUniqueEntityId(unique_entity_id)
        .build();

      castMembers.forEach((castMember) => {
        expect(castMember.uniqueEntityId).toBe(unique_entity_id);
        expect(castMember.id).toBe(unique_entity_id.value);
        expect(castMember.name).toBe("some name");
        expect(
          castMember.type.equals(CastMemberType.createActor())
        ).toBeTruthy();
        expect(castMember.created_at).toStrictEqual(created_at);
      });
    });
  });
});
