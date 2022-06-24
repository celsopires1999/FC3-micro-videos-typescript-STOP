import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { setupSequelize } from "./db";

@Table({ tableName: "stub_model", timestamps: false })
class StubModel extends Model<{ id: string; name: string }> {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  id: string;

  @Column({ allowNull: false, type: DataType.STRING })
  name: string;
}

describe("setupSequelize Unit Tests ", () => {
  setupSequelize({ models: [StubModel] });

  it("should create a model", async () => {
    await StubModel.create({
      id: "fake-id",
      name: "fake-name",
    });
    const model = StubModel.findByPk("fake-id");
    expect((await model).toJSON()).toStrictEqual({
      id: "fake-id",
      name: "fake-name",
    });
  });
});
