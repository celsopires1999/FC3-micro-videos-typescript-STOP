import { CategoryId } from "#category/domain";
import { Genre, GenreId } from "#genre/domain";
import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchProps,
  SearchResult as DefaultSearchResult,
  SearchValidationError,
  Either,
} from "#seedwork/domain";

export namespace GenreRepository {
  export type Filter = {
    name?: string;
    categories_id?: CategoryId[];
  };

  export class SearchParams extends DefaultSearchParams<Filter> {
    private constructor(props: SearchProps<Filter> = {}) {
      super(props);
    }
    static create(
      props: Omit<SearchProps<Filter>, "filter"> & {
        filter?: {
          name?: string;
          categories_id?: CategoryId[] | string[];
        };
      } = {}
    ) {
      const [categoriesId, errorCategoriesId] = Either.ok(
        props.filter.categories_id
      )
        .map((value) => value || [])
        .chainEach((value) =>
          Either.safe(() =>
            value instanceof CategoryId ? value : new CategoryId(value)
          )
        );

      if (errorCategoriesId) {
        const error = new SearchValidationError();
        error.setFromError("categories_id", errorCategoriesId);
        throw error;
      }

      return new SearchParams({
        ...props,
        filter: {
          name: props.filter?.name || null,
          categories_id: categoriesId,
        },
      });
    }

    get filter(): Filter | null {
      return this._filter;
    }

    protected set filter(value: Filter | null) {
      const _value =
        !value || (value as unknown) === "" || typeof value !== "object"
          ? null
          : value;

      const filter = {
        ...(_value.name && { name: `${_value?.name}` }),
        ...(_value.categories_id && { categories_id: _value.categories_id }),
      };

      this._filter = Object.keys(filter).length === 0 ? null : filter;
    }
  }

  export class SearchResult extends DefaultSearchResult<Genre, Filter> {
    toJSON() {
      const props = super.toJSON();
      return {
        ...props,
        filter: props.filter
          ? {
              ...(props.filter.name && { name: props.filter.name }),
              ...(props.filter.type && {
                type: props.filter.type.value,
              }),
            }
          : null,
      };
    }
  }

  export interface Repository
    extends SearchableRepositoryInterface<
      Genre,
      GenreId,
      Filter,
      SearchParams,
      SearchResult
    > {
    exists(name: string): Promise<boolean>;
  }
}

export default GenreRepository;
