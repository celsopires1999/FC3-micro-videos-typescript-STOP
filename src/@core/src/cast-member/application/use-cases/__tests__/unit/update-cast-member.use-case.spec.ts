import { UpdateCastMemberUseCase } from "#cast-member/application";
import { CastMemberFakeBuilder } from "#cast-member/domain";
import { CastMemberInMemoryRepository } from "#cast-member/infra";
import { NotFoundError } from "#seedwork/domain";

describe("UpdateCastMemberUseCase Unit Tests", () => {
  let repository: CastMemberInMemoryRepository;
  let useCase: UpdateCastMemberUseCase.UseCase;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new UpdateCastMemberUseCase.UseCase(repository);
  });
  it("should throw an error when id is not found", async () => {
    await expect(
      useCase.execute({ id: "fake-id", name: "fake", type: 1 })
    ).rejects.toThrow(new NotFoundError("Entity not found using ID fake-id"));
  });

  it("should update cast member", async () => {
    type Arrange = {
      input: {
        id: string;
        name: string;
        type: number;
      };
      expected: {
        id: string;
        name: string;
        type: number;
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
