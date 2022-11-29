import { CreateCastMemberUseCase } from "#cast-member/application";
import { CastMemberExistsError } from "#cast-member/domain/";
import { CastMemberInMemoryRepository } from "#cast-member/infra";
import { EntityValidationError } from "#seedwork/domain";

describe("CreateCastMemberUseCase Unit Tests", () => {
  let repository: CastMemberInMemoryRepository;
  let useCase: CreateCastMemberUseCase.UseCase;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase.UseCase(repository);
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

  it("should throw an error when create cast member without name", async () => {
    await expect(useCase.execute({ name: "", type: 1 })).rejects.toThrow(
      "Entity Validation Error"
    );

    await expect(useCase.execute({ name: "", type: 2 })).rejects.toThrowError(
      EntityValidationError
    );
  });

  it("should throw an error when a cast member exists already", async () => {
    await useCase.execute({ name: "John Doe", type: 1 });
    await expect(
      useCase.execute({ name: "John Doe", type: 2 })
    ).rejects.toThrowError(
      new CastMemberExistsError(
        "John Doe exists already in the categories collection"
      )
    );
  });
});
