import { UpdateCastMemberUseCase } from "#cast-member/application";
import {
  CastMember,
  CastMemberFakeBuilder,
  CastMemberType,
  InvalidCastMemberTypeError,
  Types,
} from "#cast-member/domain";
import { CastMemberInMemoryRepository } from "#cast-member/infra";
import { Either, EntityValidationError, NotFoundError } from "#seedwork/domain";

describe("UpdateCastMemberUseCase Unit Tests", () => {
  let repository: CastMemberInMemoryRepository;
  let useCase: UpdateCastMemberUseCase.UseCase;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new UpdateCastMemberUseCase.UseCase(repository);
    jest.restoreAllMocks();
  });

  describe("handleError method", () => {
    it("should throw a generic error", () => {
      const error = new Error("Generic Error");
      expect(() => useCase["handleError"](error, undefined)).toThrowError(
        error
      );
      expect(() =>
        useCase["handleError"](error, new Error("cast member type error"))
      ).toThrowError(error);
    });

    it("should throw an entity validation error", () => {
      const error = new EntityValidationError({ name: ["invalid name"] });
      expect(() => useCase["handleError"](error, undefined)).toThrowError(
        error
      );
      expect(() =>
        useCase["handleError"](error, new Error("cast member type error"))
      ).toThrowError(error);
      expect(error.error).toStrictEqual({
        name: ["invalid name"],
        type: ["cast member type error"],
      });
    });
  });

  describe("execute method", () => {
    it("should throw an error when id is not found", async () => {
      await expect(
        useCase.execute({ id: "fake-id", name: "fake", type: 1 })
      ).rejects.toThrow(new NotFoundError("Entity not found using ID fake-id"));
    });

    it("should throw a generic error", async () => {
      const entity = CastMemberFakeBuilder.aCastMember().build();
      await repository.insert(entity);
      const expectedError = new Error("Generic Error");
      jest.spyOn(repository, "update").mockRejectedValue(expectedError);
      const spyHandleError = jest.spyOn(useCase, "handleError" as any);
      await expect(
        useCase.execute({ id: entity.id, name: "Mary Doe", type: Types.ACTOR })
      ).rejects.toThrowError(expectedError);
      expect(spyHandleError).toHaveBeenCalledWith(expectedError, null);
    });

    it("should throw a entity validation error", async () => {
      const entity = CastMemberFakeBuilder.aCastMember().build();
      await repository.insert(entity);
      const expectedError = new EntityValidationError({
        name: ["invalid name"],
      });
      jest.spyOn(CastMember, "validate").mockImplementation(() => {
        throw expectedError;
      });
      const spyHandleError = jest.spyOn(useCase, "handleError" as any);
      await expect(
        useCase.execute({ id: entity.id, name: "Mary Doe", type: Types.ACTOR })
      ).rejects.toThrowError(expectedError);
      expect(spyHandleError).toHaveBeenCalledWith(expectedError, null);

      const castMemberTypeError = new InvalidCastMemberTypeError(
        "invalid type"
      );
      jest
        .spyOn(CastMemberType, "create")
        .mockImplementation(() => Either.fail(castMemberTypeError));
      await expect(
        useCase.execute({ id: entity.id, name: "Mary Doe", type: Types.ACTOR })
      ).rejects.toThrowError(expectedError);
      expect(spyHandleError).toHaveBeenCalledWith(
        expectedError,
        castMemberTypeError
      );
    });
  });

  it("should update cast member", async () => {
    type Arrange = {
      input: {
        id: string;
        name: string;
        type: Types;
      };
      expected: {
        id: string;
        name: string;
        type: Types;
        created_at: Date;
      };
    };
    const spyUpdate = jest.spyOn(repository, "update");
    const entity = CastMemberFakeBuilder.aCastMember()
      .withName("John Doe")
      .build();

    await repository.insert(entity);

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.id,
          name: "Test",
          type: 1,
        },
        expected: {
          id: entity.id,
          name: "Test",
          type: 1,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: "Test",
          type: 2,
        },
        expected: {
          id: entity.id,
          name: "Test",
          type: 2,
          created_at: entity.created_at,
        },
      },
    ];

    let output = await useCase.execute({
      id: entity.id,
      name: "Test",
      type: 1,
    });
    expect(output).toStrictEqual({
      id: entity.id,
      name: "Test",
      type: 1,
      created_at: entity.created_at,
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        name: i.input.name,
        type: i.input.type,
      });
      expect(output).toStrictEqual({
        id: entity.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });
    }
  });
});
