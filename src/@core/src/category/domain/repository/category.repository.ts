import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from "#seedwork/domain";
import { Category } from "#category/domain";

export namespace CategoryRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<Category, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Category,
      Filter,
      SearchParams,
      SearchResult
    > {
    exists(name: string): Promise<boolean>;
  }
}

export default CategoryRepository;
