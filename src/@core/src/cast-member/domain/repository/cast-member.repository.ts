import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from "#seedwork/domain";
import { CastMember } from "#cast-member/domain";

export namespace CastMemberRepository {
  export type Filter = {
    name?: string;
    type?: number;
  };

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<CastMember, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      CastMember,
      Filter,
      SearchParams,
      SearchResult
    > {
    exists(name: string): Promise<boolean>;
  }
}

export default CastMemberRepository;
