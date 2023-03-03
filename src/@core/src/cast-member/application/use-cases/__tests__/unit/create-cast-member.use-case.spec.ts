import { CreateCastMemberUseCase } from "#cast-member/application";
import {
  CastMember,
  CastMemberExistsError,
  CastMemberType,
  InvalidCastMemberTypeError,
  Types,
} from "#cast-member/domain/";
import { CastMemberInMemoryRepository } from "#cast-member/infra";
import { Either, EntityValidationError } from "#seedwork/domain";

describe("CreateCastMemberUseCase Unit Tests", () => {
  let repository: CastMemberInMemoryRepository;
  let useCase: CreateCastMemberUseCase.UseCase;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase.UseCase(repository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw a generic error", () => {
    const error = new Error("Generic Error");

    expect(() => useCase["handleError"](error, undefined)).toThrowError(error);

    expect(() =>
      useCase["handleError"](error, new InvalidCastMemberTypeError(3))
    ).toThrowError(error);
  });

  it("should throw an entity validation error", () => {
    const error = new EntityValidationError({ name: ["test error"] });
    expect(() => useCase["handleError"](error, null)).toThrowError(error);

    expect(() =>
      useCase["handleError"](error, new InvalidCastMemberTypeError(3))
    ).toThrowError(error);

    expect(error.error).toStrictEqual({
      name: ["test error"],
      type: ["Invalid cast member type: 3"],
    });
  });

  describe("execute method", () => {
    it("should throw a generic error", async () => {
      const expectedError = new Error("Generic Error");
      jest.spyOn(repository, "insert").mockRejectedValue(expectedError);
      const spyHandleError = jest.spyOn(useCase, "handleError" as any);
      await expect(
        useCase.execute({ name: "John Doe", type: Types.DIRECTOR })
      ).rejects.toThrowError(expectedError);
      expect(spyHandleError).toHaveBeenCalledWith(expectedError, null);
    });

    it("should throw an entity validation error", async () => {
      // Arrange
      const expectedError = new EntityValidationError({
        name: ["is required"],
      });
      jest.spyOn(CastMember, "validate").mockImplementation(() => {
        throw expectedError;
      });
      const spyHandleError = jest.spyOn(useCase, "handleError" as any);
      // Act & Assert
      await expect(
        useCase.execute({ name: "John Doe", type: Types.DIRECTOR })
      ).rejects.toThrowError(expectedError);
      // Assert
      expect(spyHandleError).toHaveBeenCalledWith(expectedError, null);

      // Arrange
      const castMemberTypeError = new InvalidCastMemberTypeError(
        "invalid type"
      );
      jest
        .spyOn(CastMemberType, "create")
        .mockImplementation(() => Either.fail(castMemberTypeError));
      // Act
      await expect(
        useCase.execute({ name: "John Doe", type: Types.DIRECTOR })
      ).rejects.toThrowError(expectedError);
      // Assert
      expect(spyHandleError).toHaveBeenCalledWith(
        expectedError,
        castMemberTypeError
      );
    });

    it("should throw an error when create cast member without name", async () => {
      await expect(useCase.execute({ name: "", type: 1 })).rejects.toThrow(
        "Entity Validation Error"
      );

      await expect(useCase.execute({ name: "", type: 2 })).rejects.toThrowError(
        EntityValidationError
      );
    });

    it("should throw an error when create a cast member with invalid type", async () => {
      await expect(
        useCase.execute({ name: "John Doe", type: 3 as any })
      ).rejects.toThrowError(EntityValidationError);
    });

    it("should throw Invalid cast member type message", async () => {
      try {
        await useCase.execute({ name: "John Doe", type: 3 as any });
        fail("The use case has not throw an EntityValidationError");
      } catch (e) {
        expect(e).toBeInstanceOf(EntityValidationError);
        expect(e.error).toStrictEqual({
          type: ["Invalid cast member type: 3"],
        });
      }
    });

    it("should throw merge entity and value object error messages", async () => {
      try {
        await useCase.execute({ name: "", type: 3 as any });
        fail("The use case has not throw an EntityValidationError");
      } catch (e) {
        expect(e).toBeInstanceOf(EntityValidationError);
        expect(e.error).toStrictEqual({
          name: ["name should not be empty"],
          type: ["Invalid cast member type: 3"],
        });
      }
    });

    it("should throw an error when a cast member exists already", async () => {
      await useCase.execute({ name: "John Doe", type: 1 });
      await expect(
        useCase.execute({ name: "John Doe", type: 2 })
      ).rejects.toThrowError(
        new CastMemberExistsError(
          "John Doe exists already in the cast members collection"
        )
      );
    });

    it("should create cast member", async () => {
      const spyInsert = jest.spyOn(repository, "insert");
      let output = await useCase.execute({ name: "John Doe", type: 1 });
      expect(output).toStrictEqual({
        id: repository.items[0].id,
        name: "John Doe",
        type: 1,
        created_at: repository.items[0].created_at,
      });
      expect(spyInsert).toHaveBeenCalledTimes(1);

      output = await useCase.execute({
        name: "Mary Doe",
        type: 2,
      });
      expect(output).toStrictEqual({
        id: repository.items[1].id,
        name: "Mary Doe",
        type: 2,
        created_at: repository.items[1].created_at,
      });
      expect(spyInsert).toHaveBeenCalledTimes(2);
    });
  });
});
