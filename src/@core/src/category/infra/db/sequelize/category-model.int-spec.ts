import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { DataType } from "sequelize-typescript";
import { CategorySequelize } from "#category/infra";

const { CategoryModel } = CategorySequelize;

describe("CategoryModel Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  test("mapping attributes", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());

    expect(attributes).toStrictEqual([
      "id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);

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

    expect(attributesMap.description).toMatchObject({
      field: "description",
      fieldName: "description",
      allowNull: true,
      type: DataType.TEXT(),
    });

    expect(attributesMap.is_active).toMatchObject({
      field: "is_active",
      fieldName: "is_active",
      allowNull: false,
      type: DataType.BOOLEAN(),
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
      name: "new category",
      is_active: true,
      created_at: new Date(),
    };

    const category = await CategoryModel.create(arrange);

    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
