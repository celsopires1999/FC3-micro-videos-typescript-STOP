import { InvalidCastMemberTypeError } from "../errors";
import { CastMemberType, Types } from "./cast-member-type.vo";

describe("CastMemberType Unit Tests", () => {
  it("should create cast members successfully", () => {
    let [ok, error] = CastMemberType.create(Types.DIRECTOR);
    expect(ok.value).toBe(1);
    expect(error).toBeNull();
    [ok, error] = CastMemberType.create(Types.ACTOR);
    expect(ok.value).toBe(2);
    expect(error).toBeNull();
  });

  it("should return an error when creating a cast member with invalid value", () => {
    const [ok, error] = CastMemberType.create(3 as Types);
    expect(ok).toBeNull();
    expect(error).toEqual(new InvalidCastMemberTypeError(3));
  });

  it("should create a director ", () => {
    const vo = CastMemberType.createADirector();
    expect(vo.value).toBe(1);
  });

  it("should create an actor ", () => {
    const vo = CastMemberType.createAnActor();
    expect(vo.value).toBe(2);
  });
});
