import { DeleteCastMemberUseCase } from "#cast-member/application";
import { CastMember, CastMemberFakeBuilder } from "#cast-member/domain";
import { CastMemberInMemoryRepository } from "#cast-member/infra";
import { NotFoundError } from "#seedwork/domain";

describe("DeleteCastMemberUseCase Unit Tests", () => {
  let repository: CastMemberInMemoryRepository;
  let useCase: DeleteCastMemberUseCase.UseCase;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new DeleteCastMemberUseCase.UseCase(repository);
  });
  it("should throw an error when id is not found", async () => {
    await expect(useCase.execute({ id: "fake-id" })).rejects.toThrow(
      new NotFoundError("fake-id", CastMember)
    );
  });

  it("should delete cast member", async () => {
    const spyUpdate = jest.spyOn(repository, "delete");
    const entity = CastMemberFakeBuilder.aCastMember().build();
    repository.items = [entity];

    await useCase.execute({ id: entity.id });
    expect(repository.items).toHaveLength(0);
    expect(spyUpdate).toHaveBeenCalledTimes(1);
  });
});
