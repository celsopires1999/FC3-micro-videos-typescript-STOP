import { InvalidCastMemberTypeError } from "../../errors/cast-member-type.error";
import { CastMemberType } from "../cast-member-type.vo";

describe("CastMemberType Unit Tests", () => {
  it("should create a vo ", () => {
    let vo = new CastMemberType({
      code: 1,
      description: "Director",
    });
    expect(vo).toMatchObject({
      code: 1,
      description: "Director",
    });
    vo = new CastMemberType({
      code: 2,
      description: "Actor",
    });
    expect(vo).toMatchObject({
      code: 2,
      description: "Actor",
    });
  });

  it("should throw an error", () => {
    expect(
      () =>
        new CastMemberType({
          code: 3,
          description: "error",
        })
    ).toThrowError(
      new InvalidCastMemberTypeError("code must be either 1 or 2")
    );

    expect(
      () =>
        new CastMemberType({
          code: 1,
          description: "Actor",
        })
    ).toThrowError(
      new InvalidCastMemberTypeError(
        "description must be Director when code is 1"
      )
    );

    expect(
      () =>
        new CastMemberType({
          code: 2,
          description: "Director",
        })
    ).toThrowError(
      new InvalidCastMemberTypeError("description must be Actor when code is 2")
    );
  });

  it("should create a director vo", () => {
    const vo = CastMemberType.createDirector();
    expect(vo.value).toEqual({
      code: 1,
      description: "Director",
    });
    expect(vo.code).toBe(1);
    expect(vo.description).toBe("Director");
  });

  it("should create an actor vo", () => {
    const vo = CastMemberType.createActor();
    expect(vo.value).toEqual({
      code: 2,
      description: "Actor",
    });
    expect(vo.code).toBe(2);
    expect(vo.description).toBe("Actor");
  });

  it("should not be equal", () => {
    const director = CastMemberType.createDirector();
    const actor = CastMemberType.createActor();
    expect(director.equals(actor)).toBeFalsy();
  });

  it("should be equal", () => {
    let vo1 = CastMemberType.createDirector();
    let vo2 = CastMemberType.createDirector();
    expect(vo1.equals(vo2)).toBeTruthy();

    vo1 = CastMemberType.createActor();
    vo2 = CastMemberType.createActor();
    expect(vo1.equals(vo2)).toBeTruthy();
  });

  it("should create vo by code", () => {
    let vo = CastMemberType.createByCode(1);
    expect(vo.value).toEqual({
      code: 1,
      description: "Director",
    });
    expect(vo.code).toBe(1);
    expect(vo.description).toBe("Director");

    vo = CastMemberType.createByCode(2);
    expect(vo.value).toEqual({
      code: 2,
      description: "Actor",
    });
    expect(vo.code).toBe(2);
    expect(vo.description).toBe("Actor");
  });

  it("should throw an error when code is invalid", () => {
    expect(() => CastMemberType.createByCode(3)).toThrow(
      new InvalidCastMemberTypeError(
        "code must be either 1 for Director or 2 for Actor"
      )
    );
  });
});
