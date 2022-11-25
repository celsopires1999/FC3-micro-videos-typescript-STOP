import CastMember, { CastMemberProperties } from "./../cast-member";
import { omit } from "lodash";
import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.vo";
import CastMemberType from "../cast-member-type.vo";

describe("CastMember Unit Test", () => {
  beforeEach(() => {
    CastMember.validate = jest.fn();
  });
  test("constructor of castMember", () => {
    const type = CastMemberType.createActor();
    let castMember = new CastMember({
      name: "John Doe",
      type,
    });
    let props = omit(castMember.props, "created_at");
    expect(CastMember.validate).toHaveBeenCalled();
    expect(props).toStrictEqual({
      name: "John Doe",
      type,
    });

    let created_at = new Date();
    castMember = new CastMember({
      name: "John Doe",
      type,
      created_at,
    });
    expect(castMember.props).toStrictEqual({
      name: "John Doe",
      type,
      created_at,
    });
  });

  describe("id prop", () => {
    type CastMemberData = {
      props: CastMemberProperties;
      id?: UniqueEntityId;
    };
    const type = CastMemberType.createActor();
    const arrange: CastMemberData[] = [
      { props: { name: "John Doe", type } },
      { props: { name: "John Doe", type }, id: null },
      { props: { name: "John Doe", type }, id: undefined },
      { props: { name: "John Doe", type }, id: new UniqueEntityId() },
    ];
    test.each(arrange)("%#) when props are %j", (item) => {
      const castMember = new CastMember(item.props, item.id as any);
      expect(castMember.id).not.toBeNull();
      expect(castMember.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    });
  });

  test("getter and setter of name prop", () => {
    const type = CastMemberType.createActor();
    const castMember = new CastMember({ name: "John Doe", type });
    expect(castMember.name).toBe("John Doe");

    castMember["name"] = "Mary Doe";
    expect(castMember.name).toBe("Mary Doe");
  });

  test("getter and setter of type prop", () => {
    const type = CastMemberType.createActor();
    const castMember = new CastMember({ name: "John Doe", type });
    expect(castMember.type).toStrictEqual(type);
    expect(castMember.type.equals(type)).toBeTruthy();

    castMember["type"] = type;
    expect(castMember.type).toStrictEqual(type);
  });

  test("setter of created_at prop", () => {
    const type = CastMemberType.createActor();
    const created_at = new Date();
    let castMember = new CastMember({
      name: "John Doe",
      type,
      created_at,
    });
    expect(castMember.created_at).toBe(created_at);
    expect(castMember.created_at).toBeInstanceOf(Date);
  });

  it("should update a castMember", () => {
    let type = CastMemberType.createActor();
    const castMember = new CastMember({
      name: "John Doe",
      type,
    });
    const created_at = castMember.created_at;
    type = CastMemberType.createDirector();

    castMember.update("Mary Doe", type);
    expect(CastMember.validate).toHaveBeenCalledTimes(2);
    expect(castMember.name).toBe("Mary Doe");
    expect(castMember.type).toStrictEqual(type);
    expect(castMember.props).toStrictEqual({
      name: "Mary Doe",
      type,
      created_at,
    });
  });
});
