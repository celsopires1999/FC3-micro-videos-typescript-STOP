import { ListCastMembersUseCase } from '@fc/micro-videos/cast-member/application';
import { CastMemberRepository } from '@fc/micro-videos/cast-member/domain';
import { SortDirection } from '@fc/micro-videos/dist/@seedwork/domain/repository/repository-contracts';

export class SearchCastMemberDto implements ListCastMembersUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: CastMemberRepository.Filter;
}
