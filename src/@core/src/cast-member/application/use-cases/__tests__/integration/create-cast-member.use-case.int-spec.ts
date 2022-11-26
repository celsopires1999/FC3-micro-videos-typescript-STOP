import { CreateCastMemberUseCase } from "#cast-member/application";
import { CastMemberSequelize } from "#cast-member/infra";
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

  describe("should create cast member", () => {
    const arrange = [
      {
        inputProps: { name: "John Doe", type: 1 },
        outputProps: {
          name: "John Doe",
          type: 1,
        },
      },
      {
        inputProps: { name: "John Doe", type: 2 },
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
