import { LoadEntityError } from "#seedwork/domain";
import { Sequelize } from "sequelize-typescript";
import CategoryModelMapper from "./category-mapper";
import { CategoryModel } from "./category-model";

describe("CategoryMapper Unit Test", () => {
  let sequelize: Sequelize;

  beforeAll(
    () =>
      (sequelize = new Sequelize({
        dialect: "sqlite",
        host: ":memory:",
        logging: false,
        models: [CategoryModel],
      }))
  );

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
  it("should throw error when category is invalid", async () => {
    const model = CategoryModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail("The category has not throw a LoadEntityError");
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
});
