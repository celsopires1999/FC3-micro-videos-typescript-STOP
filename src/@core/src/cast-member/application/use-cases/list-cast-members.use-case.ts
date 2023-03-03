import { CastMemberRepository, Types } from "#cast-member/domain";
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from "#seedwork/application/dto/pagination-output";
import { SearchInputDto } from "#seedwork/application/dto/search-input";
import { default as DefaultUseCase } from "#seedwork/application/use-case";
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "./dto/cast-member-output";

export namespace ListCastMembersUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private castMemberRepo: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = CastMemberRepository.SearchParams.create(input);
      const searchResult = await this.castMemberRepo.search(params);

      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: CastMemberRepository.SearchResult): Output {
      const { items: _items, filter, sort, ...otherProps } = searchResult;
      const items = _items.map((i) => CastMemberOutputMapper.toOutput(i));
      return PaginationOutputMapper.toOutput({ items, ...otherProps });
    }
  }

  export type Input = SearchInputDto<{
    name?: string;
    type?: Types;
  }>;

  export type Output = PaginationOutputDto<CastMemberOutput>;
}

export default ListCastMembersUseCase;
