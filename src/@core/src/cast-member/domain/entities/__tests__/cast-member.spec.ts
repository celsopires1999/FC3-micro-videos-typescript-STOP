import { omit } from "lodash";
import { CastMemberType } from "../../value-objects/cast-member-type.vo";
import CastMember, {
  CastMemberId,
  CastMemberProperties,
} from "./../cast-member";

describe("CastMember Unit Test", () => {
  beforeEach(() => {
    CastMember.validate = jest.fn();
  });
  test("constructor of castMember", () => {
    const type = CastMemberType.createAnActor();
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
      id?: CastMemberId;
    };
    const type = CastMemberType.createAnActor();
    const arrange: CastMemberData[] = [
      { props: { name: "John Doe", type } },
      { props: { name: "John Doe", type }, id: null },
      { props: { name: "John Doe", type }, id: undefined },
      { props: { name: "John Doe", type }, id: new CastMemberId() },
    ];
    test.each(arrange)("%#) when props are %j", (item) => {
      const castMember = new CastMember(item.props, item.id as any);
      expect(castMember.id).not.toBeNull();
      expect(castMember.entityId).toBeInstanceOf(CastMemberId);
    });
  });

  test("getter and setter of name prop", () => {
    const type = CastMemberType.createAnActor();
    const castMember = new CastMember({ name: "John Doe", type });
    expect(castMember.name).toBe("John Doe");

    castMember["name"] = "Mary Doe";
    expect(castMember.name).toBe("Mary Doe");
  });

  test("getter and setter of type prop", () => {
    const type = CastMemberType.createAnActor();
    const castMember = new CastMember({ name: "John Doe", type });
    expect(castMember.type).toStrictEqual(type);
    expect(castMember.type.equals(type)).toBeTruthy();

    castMember["type"] = type;
    expect(castMember.type).toStrictEqual(type);
  });

  test("setter of created_at prop", () => {
    const type = CastMemberType.createAnActor();
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
    let type = CastMemberType.createAnActor();
    const castMember = new CastMember({
      name: "John Doe",
      type,
    });
    const created_at = castMember.created_at;
    type = CastMemberType.createADirector();

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

  it("should converte to JSON", () => {
    const castMember = new CastMember({
      name: "John Doe",
      type: CastMemberType.createAnActor(),
    });

    expect(castMember.toJSON()).toEqual({
      id: castMember.id,
      name: castMember.name,
      type: castMember.type.value,
      created_at: castMember.created_at,
    });
  });
});
