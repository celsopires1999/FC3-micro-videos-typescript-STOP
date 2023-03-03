import { CastMember } from "#cast-member/domain";
import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchProps,
  SearchResult as DefaultSearchResult,
  SearchValidationError,
} from "#seedwork/domain";
import { CastMemberType, Types } from "../value-objects/cast-member-type.vo";

export namespace CastMemberRepository {
  export type Filter = {
    name?: string;
    type?: CastMemberType;
  };

  export class SearchParams extends DefaultSearchParams<Filter> {
    private constructor(props: SearchProps<Filter> = {}) {
      super(props);
    }
    static create(
      props: Omit<SearchProps<Filter>, "filter"> & {
        filter?: {
          name?: string;
          type?: Types;
        };
      } = {}
    ) {
      const [type, errorCastMemberType] = props.filter?.type
        ? CastMemberType.create(props.filter.type)
        : [null, null];

      if (errorCastMemberType) {
        const error = new SearchValidationError();
        error.setFromError("type", errorCastMemberType);
        throw error;
      }

      return new SearchParams({
        ...props,
        filter: {
          name: props.filter?.name || null,
          type: type,
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
        ...(_value.type && { type: _value.type }),
      };

      this._filter = Object.keys(filter).length === 0 ? null : filter;
    }
  }

  export class SearchResult extends DefaultSearchResult<CastMember, Filter> {
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
      CastMember,
      Filter,
      SearchParams,
      SearchResult
    > {
    exists(name: string): Promise<boolean>;
  }
}

export default CastMemberRepository;
