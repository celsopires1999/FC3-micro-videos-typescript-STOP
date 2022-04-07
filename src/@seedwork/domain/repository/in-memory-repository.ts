import Entity from "../entity/entity";
import NotFoundError from "../errors/not-found.error";
import uniqueEntityId from "../value-objects/unique-entity-id.vo";
import {
  RepositoryInterface,
  SerachableRepositoryInterface,
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
  implements SerachableRepositoryInterface<E, any, any>
{
  search(props: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
