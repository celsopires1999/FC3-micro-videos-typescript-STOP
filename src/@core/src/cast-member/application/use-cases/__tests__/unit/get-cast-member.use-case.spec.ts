import {
  CreateCastMemberUseCase,
  GetCastMemberUseCase,
} from "#cast-member/application/";

import { CastMemberInMemoryRepository } from "#cast-member/infra";
import { NotFoundError } from "#seedwork/domain";

let repository: CastMemberInMemoryRepository;
let useCase: GetCastMemberUseCase.UseCase;

beforeEach(() => {
  repository = new CastMemberInMemoryRepository();
  useCase = new GetCastMemberUseCase.UseCase(repository);
});

describe("GetCastMemberUseCase Unit Tests", () => {
  it("should throw an error when id is not found", async () => {
    await expect(useCase.execute({ id: "fake-id" })).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake-id")
    );
  });

  it("should get a category", async () => {
    const createdCastMember = await new CreateCastMemberUseCase.UseCase(
      repository
    ).execute({ name: "John Doe", type: 1 });

    const spyFindById = jest.spyOn(repository, "findById");
    useCase = new GetCastMemberUseCase.UseCase(repository);
    const outputUseCase = await useCase.execute({
      id: createdCastMember.id,
    });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(outputUseCase).toStrictEqual(createdCastMember);
  });
});
