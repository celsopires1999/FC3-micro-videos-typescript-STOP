import {
  CastMember,
  CastMemberRepository,
  CastMemberExistsError,
  CastMemberType,
  Types,
} from "#cast-member/domain";
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "./dto/cast-member-output";
import { default as DefaultUseCase } from "#seedwork/application/use-case";
import { EntityValidationError } from "#seedwork/domain";

export namespace CreateCastMemberUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private castMemberRepo: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const [type, errorCastMemberType] = CastMemberType.create(input.type);

      try {
        const entity = new CastMember({
          ...input,
          type,
        });
        await this.validateExistsName(input.name);
        await this.castMemberRepo.insert(entity);
        return CastMemberOutputMapper.toOutput(entity);
      } catch (e) {
        this.handleError(e, errorCastMemberType);
      }
    }

    private async validateExistsName(name: string): Promise<void> {
      if (await this.castMemberRepo.exists(name)) {
        throw new CastMemberExistsError(
          `${name} exists already in the cast members collection`
        );
      }
    }

    private handleError(e: Error, errorCastMemberType: Error | undefined) {
      if (e instanceof EntityValidationError) {
        e.setFromError("type", errorCastMemberType);
      }

      throw e;
    }
  }

  export type Input = {
    name: string;
    type: Types;
  };

  export type Output = CastMemberOutput;
}

export default CreateCastMemberUseCase;
