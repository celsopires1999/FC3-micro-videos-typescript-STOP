import { Category } from "#category/domain";
import { NotFoundError } from "#seedwork/domain";
import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category-model";
import CategorySequelizeRepository from "./category-repository";

describe("CategorySequelizeRepository Unit Tests", () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

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
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should insert a new entity", async () => {
    let entity = new Category({ name: "new category" });
    repository.insert(entity);
    let model = await CategoryModel.findByPk(entity.id);
    expect(model.toJSON()).toStrictEqual(entity.toJSON());

    entity = new Category({
      name: "new category",
      description: "new description",
      is_active: false,
      created_at: new Date(),
    });
    repository.insert(entity);
    model = await CategoryModel.findByPk(entity.id);
    expect(model.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should find an entity", async () => {
    let entity = new Category({ name: "new category" });
    repository.insert(entity);
    const category = await repository.findById(entity.id);
    expect(category.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should throw an error when entity has not been found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake id")
    );
    await expect(
      repository.findById("312cffad-1938-489e-a706-643dc9a3cfd3")
    ).rejects.toThrow(
      new NotFoundError(
        "Entity not found using ID 312cffad-1938-489e-a706-643dc9a3cfd3"
      )
    );
  });

  it("should find an entity by Id", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });
});
