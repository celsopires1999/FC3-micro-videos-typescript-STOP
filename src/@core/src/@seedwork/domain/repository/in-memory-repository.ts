import Entity from "../entity/entity";
import NotFoundError from "../errors/not-found.error";
import uniqueEntityId from "../value-objects/unique-entity-id.vo";
import {
  RepositoryInterface,
  SearchParams,
  SearchResult,
  SearchableRepositoryInterface,
  SortDirection,
} from "./repository-contracts";

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    let item: E;

    try {
      item = await this._get(entity.id);
    } catch (e) {}

    if (item) {
      throw new Error(`Entity has already been included with ID ${entity.id}`);
    }

    this.items.push(entity);
  }

  async findById(id: string | uniqueEntityId): Promise<E> {
    let _id = `${id}`;
    if (typeof id !== "string") {
      _id = id.value;
    }
    return this._get(_id);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const indexFound = this.items.findIndex((i) => i.id === entity.id);
    this.items[indexFound] = entity;
  }

  async delete(id: string | uniqueEntityId): Promise<void> {
    let _id = `${id}`;
    if (typeof id !== "string") {
      _id = id.value;
    }
    await this._get(_id);
    const indexFound = this.items.findIndex((i) => i.id === _id);
    this.items.splice(indexFound, 1);
  }

  protected async _get(_id: string): Promise<E> {
    const item = this.items.find((i) => i.id === _id);
    if (!item) {
      throw new NotFoundError(`Entity not found using ID ${_id}`);
    }
    return item;
  }
}

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E>
{
  sortableFields: string[] = [];

  async search(props: SearchParams): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);

    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sort_dir
    );

    const itemsPaginated = await this.applyPaginate(
      itemsSorted,
      props.page,
      props.per_page
    );

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sort_dir === "asc" ? -1 : 1;
      }

      if (a.props[sort] > b.props[sort]) {
        return sort_dir === "asc" ? 1 : -1;
      }

      return 0;
    });
  }

  protected async applyPaginate(
    items: E[],
    page: SearchParams["page"],
    per_page: SearchParams["per_page"]
  ): Promise<E[]> {
    const start = (page - 1) * per_page;
    const limit = start + per_page;

    return items.slice(start, limit);
  }
}
