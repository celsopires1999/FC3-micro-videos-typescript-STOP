import {
  Table,
  Column,
  PrimaryKey,
  Model,
  DataType,
} from "sequelize-typescript";
import SequelizeModelFactory from "./sequelize-model-factory";
import { validate as uuidValidate } from "uuid";
import _chance from "chance";
import { setupSequelize } from "../testing/helpers/db";

const chance = _chance();

@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word(),
  }));

  static factory() {
    return new SequelizeModelFactory(StubModel, StubModel.mockFactory);
  }
}

setupSequelize({ models: [StubModel] });

describe("SequelizeModelFactory Unit Tests", () => {
  test("create method", async () => {
    let model = await StubModel.factory().create();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();
    expect((await StubModel.findByPk(model.id)).id).toBe(model.id);

    model = await StubModel.factory().create({
      id: "0e094018-c85b-406d-a35b-1f338cf8f568",
      name: "some model",
    });
    expect(model.id).toBe("0e094018-c85b-406d-a35b-1f338cf8f568");
    expect(model.name).toBe("some model");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    expect(
      (await StubModel.findByPk("0e094018-c85b-406d-a35b-1f338cf8f568")).id
    ).toBe(model.id);
  });
});
