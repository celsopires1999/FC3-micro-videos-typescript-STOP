import { validate as uuidValidate } from "uuid";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import Entity from "./entity";

type StubEntityProps = {
  prop1: string;
  prop2: number;
};

type StubEntityJsonProps = Required<{ id: string } & StubEntityProps>;

class StubEntity extends Entity<
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
      prop1: this.props.prop1,
      prop2: this.props.prop2,
    };
  }
}

describe("Entity Unit Tests", () => {
  it("should set props and id", () => {
    const arrange = { prop1: "prop1 value", prop2: 123 };
    const entity = new StubEntity(arrange);
    expect(entity.props).toStrictEqual(arrange);
    expect(entity.entityId).toBeInstanceOf(UniqueEntityId);
    expect(uuidValidate(entity.id)).toBeTruthy();
  });

  it("should accept a valid uuid", () => {
    const arrange = { prop1: "prop1 value", prop2: 123 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.entityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.entityId).toBe(uniqueEntityId);
    expect(entity.id).toBe(uniqueEntityId.value);
  });

  it("should convert an entity to a JavaScript Object", () => {
    const arrange = { prop1: "prop1 value", prop2: 123 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      ...arrange,
    });
  });

  it("should not be equal", () => {
    const arrange = { prop1: "prop1 value", prop2: 123 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    const otherEntity = new StubEntity(arrange);
    expect(entity.equals(otherEntity)).toBeFalsy();
  });

  it("should be equal", () => {
    const arrange = { prop1: "prop1 value", prop2: 123 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    const otherEntity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.equals(otherEntity)).toBeTruthy();
  });
});
