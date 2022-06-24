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
    return new SequelizeModelFactory<StubModel, { id: string; name: string }>(
      StubModel,
      StubModel.mockFactory
    );
  }
}

describe("SequelizeModelFactory Unit Tests", () => {
  setupSequelize({ models: [StubModel] });

  test("create method", async () => {
    let model = await StubModel.factory().create();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.id).not.toBeNull();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    let modelFound = await StubModel.findByPk(model.id);
    expect(modelFound.id).toBe(model.id);

    model = await StubModel.factory().create({
      id: "0e094018-c85b-406d-a35b-1f338cf8f568",
      name: "some model",
    });
    expect(model.id).toBe("0e094018-c85b-406d-a35b-1f338cf8f568");
    expect(model.name).toBe("some model");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    modelFound = await StubModel.findByPk(model.id);
    expect(modelFound.id).toBe(model.id);
  });

  test("make method", async () => {
    let model = StubModel.factory().make();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.id).not.toBeNull();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    model = StubModel.factory().make({
      id: "0e094018-c85b-406d-a35b-1f338cf8f568",
      name: "some model",
    });
    expect(model.id).toBe("0e094018-c85b-406d-a35b-1f338cf8f568");
    expect(model.name).toBe("some model");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test("bulkCreate method using count = 1", async () => {
    let models = await StubModel.factory().bulkCreate();
    expect(models).toHaveLength(1);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    let modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound.id).toBe(models[0].id);

    models = await StubModel.factory().bulkCreate(() => ({
      id: "0e094018-c85b-406d-a35b-1f338cf8f568",
      name: "some model",
    }));
    expect(models).toHaveLength(1);
    expect(models[0].id).toBe("0e094018-c85b-406d-a35b-1f338cf8f568");
    expect(models[0].name).toBe("some model");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound.id).toBe(models[0].id);
  });

  test("bulkCreate method using count > 1", async () => {
    let models = await StubModel.factory().count(2).bulkCreate();
    expect(models).toHaveLength(2);

    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();

    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();

    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    let modelFound1 = await StubModel.findByPk(models[0].id);
    expect(modelFound1.id).toBe(models[0].id);

    let modelFound2 = await StubModel.findByPk(models[0].id);
    expect(modelFound2.id).toBe(models[0].id);

    models = await StubModel.factory()
      .count(2)
      .bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: "some model",
      }));

    expect(models).toHaveLength(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).toBe("some model");

    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
    modelFound1 = await StubModel.findByPk(models[0].id);
    expect(modelFound1.id).toBe(models[0].id);
  });

  test("bulkMake method using count = 1", async () => {
    let models = StubModel.factory().bulkMake();
    expect(models).toHaveLength(1);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    models = StubModel.factory().bulkMake(() => ({
      id: "0e094018-c85b-406d-a35b-1f338cf8f568",
      name: "some model",
    }));
    expect(models).toHaveLength(1);
    expect(models[0].id).toBe("0e094018-c85b-406d-a35b-1f338cf8f568");
    expect(models[0].name).toBe("some model");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test("bulkMake method using count > 1", async () => {
    let models = StubModel.factory().count(2).bulkMake();
    expect(models).toHaveLength(2);

    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();

    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();

    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    models = StubModel.factory()
      .count(2)
      .bulkMake(() => ({
        id: chance.guid({ version: 4 }),
        name: "some model",
      }));
    expect(models).toHaveLength(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).toBe("some model");

    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });
});
