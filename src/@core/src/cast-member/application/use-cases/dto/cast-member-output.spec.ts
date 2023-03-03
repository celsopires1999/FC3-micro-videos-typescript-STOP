import { CastMemberOutputMapper } from "./cast-member-output";
import { CastMemberFakeBuilder } from "#cast-member/domain";

describe("CastMemberOutputMapper Unit Tests", () => {
  it("should convert cast member into output", () => {
    const entity = CastMemberFakeBuilder.aCastMember().build();
    const spyToJSON = jest.spyOn(entity, "toJSON");
    const output = CastMemberOutputMapper.toOutput(entity);

    expect(spyToJSON).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      type: entity.type.value,
      created_at: entity.created_at,
    });
  });
});
