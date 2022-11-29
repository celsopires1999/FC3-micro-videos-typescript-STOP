import { CastMemberRepository, CastMemberType } from "#cast-member/domain";
import { default as DefaultUseCase } from "#seedwork/application/use-case";
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "./dto/cast-member-output";

export namespace UpdateCastMemberUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private castMemberRepo: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.castMemberRepo.findById(input.id);
      entity.update(input.name, CastMemberType.createByCode(input.type));

      await this.castMemberRepo.update(entity);

      return CastMemberOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
    name: string;
    type: number;
  };

  export type Output = CastMemberOutput;
}

export default UpdateCastMemberUseCase;
