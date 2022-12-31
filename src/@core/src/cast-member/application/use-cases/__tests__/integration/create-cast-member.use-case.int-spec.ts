import { CreateCastMemberUseCase } from "#cast-member/application";
import { Types } from "#cast-member/domain";
import { CastMemberSequelize } from "#cast-member/infra";
import { EntityValidationError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CastMemberModel, CastMemberRepository } = CastMemberSequelize;

describe("CastMemberSequelizeRepository Integration Tests", () => {
  setupSequelize({ models: [CastMemberModel] });

  let repository: CastMemberSequelize.CastMemberRepository;
  let useCase: CreateCastMemberUseCase.UseCase;

  beforeEach(async () => {
    repository = new CastMemberRepository(CastMemberModel);
    useCase = new CreateCastMemberUseCase.UseCase(repository);
  });

  it("should throw a generic error", async () => {
    // Arrange
    const genericError = new Error("Generic Error");
    jest.spyOn(repository, "insert").mockRejectedValue(genericError);
    // Act & Assert
    await expect(
      useCase.execute({ name: "John Doe", type: Types.ACTOR })
    ).rejects.toThrowError(genericError);
  });

  it("should throw an entity validation error", async () => {
    try {
      await useCase.execute({} as any);
      fail("should throw an entity validation error");
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect(e.error).toEqual({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
        type: ["Invalid cast member type: undefined"],
      });
    }
  });

  describe("should create cast member", () => {
    const arrange = [
      {
        inputProps: { name: "John Doe", type: 1 as Types },
        outputProps: {
          name: "John Doe",
          type: 1,
        },
      },
      {
        inputProps: { name: "John Doe", type: 2 as Types },
        outputProps: {
          name: "John Doe",
          type: 2,
        },
      },
    ];

    test.each(arrange)(
      "when input is $inputProps, output is $outputProps",
      async ({ inputProps, outputProps }) => {
        const output = await useCase.execute(inputProps);
        const entity = await repository.findById(output.id);
        expect(entity.id).toBe(output.id);
        expect(entity.created_at).toStrictEqual(output.created_at);
        expect(output).toMatchObject(outputProps);
      }
    );
  });
});
