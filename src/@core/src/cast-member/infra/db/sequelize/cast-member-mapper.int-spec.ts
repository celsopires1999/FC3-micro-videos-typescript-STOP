import { CastMember, CastMemberId, CastMemberType } from "#cast-member/domain";
import { CastMemberSequelize } from "#cast-member/infra";
import { LoadEntityError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CastMemberModel, CastMemberModelMapper } = CastMemberSequelize;

describe("CastMemberMapper Integration Test", () => {
  setupSequelize({ models: [CastMemberModel] });

  it("should throw error when cast member is invalid", () => {
    const model = CastMemberModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      type: 1,
    });
    try {
      CastMemberModelMapper.toEntity(model);
      fail("The cast member has not thrown a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should throw error when cast member type is invalid", () => {
    const model = CastMemberModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      name: "John Doe",
      type: 3 as any,
    });
    try {
      CastMemberModelMapper.toEntity(model);
      fail("The cast member has not thrown a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        type: ["Invalid cast member type: 3"],
      });
    }
  });

  it("should throw a generic error", () => {
    const model = CastMemberModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      type: 1,
    });

    const error = new Error("Generic Error");

    const spyValidate = jest
      .spyOn(CastMember, "validate")
      .mockImplementation(() => {
        throw error;
      });

    expect(() => CastMemberModelMapper.toEntity(model)).toThrowError(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a cast member model into a cast member entity", () => {
    const created_at = new Date();
    const model = CastMemberModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      name: "John Doe",
      type: 1,
      created_at,
    });

    const castMember = CastMemberModelMapper.toEntity(model);

    expect(castMember.toJSON()).toStrictEqual(
      new CastMember(
        {
          name: "John Doe",
          type: CastMemberType.createADirector(),
          created_at,
        },
        new CastMemberId("312cffad-1938-489e-a706-643dc9a3cfd3")
      ).toJSON()
    );
  });
});
