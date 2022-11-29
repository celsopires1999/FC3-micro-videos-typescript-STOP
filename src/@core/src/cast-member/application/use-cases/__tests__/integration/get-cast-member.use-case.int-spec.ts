import { GetCastMemberUseCase } from "#cast-member/application";
import { CastMemberFakeBuilder } from "#cast-member/domain";
import { CastMemberSequelize } from "#cast-member/infra";
import { NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CastMemberModel, CastMemberRepository } = CastMemberSequelize;

setupSequelize({ models: [CastMemberModel] });

let repositoy: CastMemberSequelize.CastMemberRepository;
let useCase: GetCastMemberUseCase.UseCase;

beforeEach(() => {
  repositoy = new CastMemberRepository(CastMemberModel);
  useCase = new GetCastMemberUseCase.UseCase(repositoy);
});
describe("GetCastMemberUseCase Integration Tests", () => {
  it("should throw an error when cast member not found", async () => {
    await expect(useCase.execute({ id: "fake id" })).rejects.toThrowError(
      new NotFoundError("Entity not found using ID fake id")
    );
  });

  it("should get a cast member", async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build();
    await repositoy.insert(entity);
    const output = await useCase.execute({ id: entity.id });

    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      type: entity.type.code,
      created_at: entity.created_at,
    });
  });
});
