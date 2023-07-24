import { UpdateCastMemberUseCase } from "#cast-member/application";
import { CastMember, Types } from "#cast-member/domain";
import { CastMemberSequelize } from "#cast-member/infra";
import { EntityValidationError, NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CastMemberModel, CastMemberRepository } = CastMemberSequelize;
setupSequelize({ models: [CastMemberModel] });

let repository: CastMemberSequelize.CastMemberRepository;
let useCase: UpdateCastMemberUseCase.UseCase;

beforeEach(() => {
  repository = new CastMemberRepository(CastMemberModel);
  useCase = new UpdateCastMemberUseCase.UseCase(repository);
});

describe("UpdateCastMemberUseCase Integration Tests", () => {
  it("should throw an error on update when cast member is not found", async () => {
    await expect(
      useCase.execute({
        id: "fake id",
        name: "fake name",
        type: 1,
      })
    ).rejects.toThrowError(new NotFoundError("fake id", CastMember));
  });

  it("should throw a generic error", async () => {
    const entity = CastMember.fake().aCastMember().build();
    await repository.insert(entity);
    const error = new Error("Generic Error");
    jest.spyOn(repository, "update").mockRejectedValue(error);
    await expect(
      useCase.execute({
        id: entity.id,
        name: "Mary Doe",
        type: 2 as Types,
      })
    ).rejects.toThrowError(error);
  });

  it("should throw an entity validation error", async () => {
    const entity = CastMember.fake().aCastMember().build();
    await repository.insert(entity);
    try {
      await useCase.execute({
        id: entity.id,
      } as any);
      fail("should throw an entity validation error");
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect(e.error).toStrictEqual({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
        type: ["Invalid cast member type: undefined"],
      });
    }
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

    const entity = CastMember.fake().aCastMember().build();
    repository.insert(entity);

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

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        name: i.input.name,
        type: i.input.type,
      });
      const updatedEntity = await repository.findById(entity.id);

      expect(output).toStrictEqual({
        id: entity.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });

      expect(updatedEntity.toJSON()).toStrictEqual({
        id: entity.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });
    }
  });
});
