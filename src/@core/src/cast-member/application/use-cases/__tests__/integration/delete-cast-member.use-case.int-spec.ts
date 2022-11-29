import { DeleteCastMemberUseCase } from "#cast-member/application";
import { CastMemberFakeBuilder } from "#cast-member/domain";
import { CastMemberSequelize } from "#cast-member/infra";
import { NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CastMemberModel, CastMemberRepository } = CastMemberSequelize;

let repository: CastMemberSequelize.CastMemberRepository;
let useCase: DeleteCastMemberUseCase.UseCase;

setupSequelize({ models: [CastMemberModel] });

beforeEach(() => {
  repository = new CastMemberRepository(CastMemberModel);
  useCase = new DeleteCastMemberUseCase.UseCase(repository);
});

describe("DeleteCastMemberUseCase Integration Tests", () => {
  it("should throw an error on delete when cast member not found", async () => {
    await expect(useCase.execute({ id: "fake Id" })).rejects.toThrowError(
      new NotFoundError("Entity not found using ID fake Id")
    );
  });
  it("should delete a cast member", async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build();
    await repository.insert(entity);
    let castMembers = await repository.findAll();
    expect(castMembers.length).toBe(1);

    await useCase.execute({ id: entity.id });
    castMembers = await repository.findAll();
    expect(castMembers.length).toBe(0);
  });
});
