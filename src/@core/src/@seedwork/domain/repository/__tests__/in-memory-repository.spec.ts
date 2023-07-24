import AggregateRoot from "#seedwork/domain/entity/aggregate-root";
import { UniqueEntityId } from "#seedwork/domain/value-objects";
import NotFoundError from "../../errors/not-found.error";
import { InMemoryRepository } from "../in-memory-repository";

type StubEntityProps = {
  name: string;
  price: number;
};

type StubEntityJsonProps = Required<{ id: string } & StubEntityProps>;

class StubEntity extends AggregateRoot<
  UniqueEntityId,
  StubEntityProps,
  StubEntityJsonProps
> {
  constructor(public readonly props: StubEntityProps, id?: UniqueEntityId) {
    super(props, id || new UniqueEntityId());
  }

  toJSON(): StubEntityJsonProps {
    return {
      id: this.id.toString(),
      name: this.props.name,
      price: this.props.price,
    };
  }
}
class StubInMemoryRepository extends InMemoryRepository<
  StubEntity,
  UniqueEntityId
> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repository: StubInMemoryRepository;
  beforeEach(() => (repository = new StubInMemoryRepository()));

  it("should insert a new entity", async () => {
    const entity = new StubEntity({ name: "some name", price: 10 });
    await repository.insert(entity);
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throw an error when entity has already been included", async () => {
    const entity = new StubEntity({ name: "some name", price: 10 });
    await repository.insert(entity);
    await expect(repository.insert(entity)).rejects.toThrowError(
      `Entity has already been included with ID ${entity.id}`
    );
  });

  it("should throw an error when entity has not been found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("fake id", StubEntity)
    );
    await expect(
      repository.findById("312cffad-1938-489e-a706-643dc9a3cfd3")
    ).rejects.toThrow(
      new NotFoundError("312cffad-1938-489e-a706-643dc9a3cfd3", StubEntity)
    );
  });

  it("should find an entity by Id", async () => {
    const entity = new StubEntity({ name: "some name", price: 10 });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.entityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all entities", async () => {
    const entity = new StubEntity({ name: "some name", price: 10 });
    await repository.insert(entity);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  it("should throw an error on update when entity has not been found", async () => {
    const entity = new StubEntity({ name: "some name", price: 10 });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.id, StubEntity)
    );
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({ name: "some name", price: 10 });
    await repository.insert(entity);

    const entityUpdated = new StubEntity(
      { name: "new name", price: 20 },
      entity.entityId
    );
    await repository.update(entityUpdated);

    expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throw an error on delete when entity has not been found", async () => {
    await expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError("fake id", StubEntity)
    );
    await expect(
      repository.delete("312cffad-1938-489e-a706-643dc9a3cfd3")
    ).rejects.toThrow(
      new NotFoundError("312cffad-1938-489e-a706-643dc9a3cfd3", StubEntity)
    );
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({ name: "some name", price: 10 });
    await repository.insert(entity);

    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);
    await repository.delete(entity.entityId);
    expect(repository.items).toHaveLength(0);
  });
});
