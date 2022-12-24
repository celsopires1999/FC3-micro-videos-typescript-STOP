import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { DataType } from "sequelize-typescript";
import { CastMemberSequelize } from "#cast-member/infra";
import { CastMemberType } from "#cast-member/domain";

const { CastMemberModel } = CastMemberSequelize;

describe("CastMemberModel Integration Tests", () => {
  setupSequelize({ models: [CastMemberModel] });

  test("mapping attributes", () => {
    const attributesMap = CastMemberModel.getAttributes();
    const attributes = Object.keys(CastMemberModel.getAttributes());

    expect(attributes).toStrictEqual(["id", "name", "type", "created_at"]);

    expect(attributesMap.id).toMatchObject({
      field: "id",
      fieldName: "id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    expect(attributesMap.name).toMatchObject({
      field: "name",
      fieldName: "name",
      allowNull: false,
      type: DataType.STRING(255),
    });

    expect(attributesMap.type).toMatchObject({
      field: "type",
      fieldName: "type",
      allowNull: false,
      type: DataType.INTEGER(),
    });

    expect(attributesMap.created_at).toMatchObject({
      field: "created_at",
      fieldName: "created_at",
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  test("create", async () => {
    const arrange = {
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      name: "John Doe",
      type: CastMemberType.createADirector().value,
      created_at: new Date(),
    };

    const castMember = await CastMemberModel.create(arrange);

    expect(castMember.toJSON()).toStrictEqual(arrange);
  });
});
