import { CastMemberRepository } from "#cast-member/domain/repository";
import { default as DefaultUseCase } from "#seedwork/application/use-case";

export namespace DeleteCastMemberUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private castMemberRepo: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.castMemberRepo.findById(input.id);
      await this.castMemberRepo.delete(entity.id);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = void;
}

export default DeleteCastMemberUseCase;
