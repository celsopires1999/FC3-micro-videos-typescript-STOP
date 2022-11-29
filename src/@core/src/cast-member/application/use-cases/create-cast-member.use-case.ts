import {
  CastMember,
  CastMemberRepository,
  CastMemberExistsError,
  CastMemberType,
} from "#cast-member/domain";
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "./dto/cast-member-output";
import { default as DefaultUseCase } from "#seedwork/application/use-case";

export namespace CreateCastMemberUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private castMemberRepo: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { type, ...restInput } = input;
      const entity = new CastMember({
        type: CastMemberType.createByCode(type),
        ...restInput,
      });
      await this.validateExistsName(input.name);
      await this.castMemberRepo.insert(entity);

      return CastMemberOutputMapper.toOutput(entity);
    }
    private async validateExistsName(name: string): Promise<void> {
      if (await this.castMemberRepo.exists(name)) {
        throw new CastMemberExistsError(
          `${name} exists already in the categories collection`
        );
      }
    }
  }
  export type Input = {
    name: string;
    type: number;
  };

  export type Output = CastMemberOutput;
}

export default CreateCastMemberUseCase;
