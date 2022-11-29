import CastMemberType from "../cast-member-type.vo";
import CastMember from "./../cast-member";

describe("CastMember Integration Tests", () => {
  describe("create method", () => {
    it("should throw an error when name is invalid", () => {
      expect(() => new CastMember({ name: null } as any)).containsErrorMessages(
        {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        }
      );

      expect(() => new CastMember({ name: "" } as any)).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(
        () => new CastMember({ name: 5 as any } as any)
      ).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(
        () => new CastMember({ name: "t".repeat(256) } as any)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should throw an error when type is invalid", () => {
      expect(() => new CastMember({ type: 5 } as any)).containsErrorMessages({
        type: [
          "type must be an instance of CastMemberType",
          "type must be a non-empty object",
        ],
      });
    });

    it("should create a cast member with valid attributes", () => {
      expect.assertions(0);
      const type = CastMemberType.createActor();
      new CastMember({ name: "John Doe", type }); // NOSONAR
      new CastMember({ name: "John Doe", type, created_at: new Date() }); // NOSONAR
      /* NOSONAR */ new CastMember({
        name: "John Doe",
        type,
      });
    });
  });

  describe("update method", () => {
    it("should throw an error when name is invalid", () => {
      const castMember = new CastMember({
        name: "John Doe",
        type: CastMemberType.createActor(),
      });
      expect(() => castMember.update(null, null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => castMember.update("", null)).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => castMember.update(5 as any, null)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        castMember.update("t".repeat(256), null)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should throw an error when type is invalid", () => {
      const castMember = new CastMember({
        name: "John Doe",
        type: CastMemberType.createActor(),
      });

      expect(() =>
        castMember.update("some name", 5 as any)
      ).containsErrorMessages({
        type: [
          "type must be an instance of CastMemberType",
          "type must be a non-empty object",
        ],
      });

      expect(() =>
        castMember.update("some name", true as any)
      ).containsErrorMessages({
        type: [
          "type must be an instance of CastMemberType",
          "type must be a non-empty object",
        ],
      });

      expect(() =>
        castMember.update("some name", false as any)
      ).containsErrorMessages({
        type: [
          "type must be an instance of CastMemberType",
          "type must be a non-empty object",
        ],
      });

      expect(() =>
        castMember.update("some name", new Date() as any)
      ).containsErrorMessages({
        type: [
          "type must be an instance of CastMemberType",
          "type must be a non-empty object",
        ],
      });
    });

    it("should update a castMember with valid properties", () => {
      expect.assertions(0);
      const castMember = new CastMember({
        name: "John Doe",
        type: CastMemberType.createActor(),
      });
      const type = CastMemberType.createDirector();
      castMember.update("Mary Doe", type);
    });
  });
});
