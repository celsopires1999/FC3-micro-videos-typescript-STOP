import { Category, CategoryId, CategoryRepository } from "#category/domain";
import { CategorySequelize } from "#category/infra";
import { NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import _chance from "chance";

const chance = _chance();

const { CategoryModel, CategoryModelMapper } = CategorySequelize;

describe("CategorySequelizeRepository Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  let repository: CategorySequelize.CategoryRepository;

  beforeEach(async () => {
    repository = new CategorySequelize.CategoryRepository(CategoryModel);
  });

  it("should insert a new entity", async () => {
    let entity = new Category({ name: "new category" });
    repository.insert(entity);
    let foundEntity = await repository.findById(entity.id);
    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());

    entity = new Category({
      name: "new category",
      description: "new description",
      is_active: false,
      created_at: new Date(),
    });
    repository.insert(entity);
    foundEntity = await repository.findById(entity.id);
    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should find an entity", async () => {
    let entity = new Category({ name: "new category" });
    repository.insert(entity);
    const category = await repository.findById(entity.id);
    expect(category.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should throw an error when entity has not been found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("fake id", Category)
    );
    await expect(
      repository.findById("312cffad-1938-489e-a706-643dc9a3cfd3")
    ).rejects.toThrow(
      new NotFoundError("312cffad-1938-489e-a706-643dc9a3cfd3", Category)
    );
  });

  it("should find an entity by Id", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.entityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all categories", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toStrictEqual(JSON.stringify([entity]));
  });

  it("should throw error on update when category is not found", async () => {
    const entity = new Category({ name: "some name" });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.id, Category)
    );
  });

  it("should update a category", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);

    entity.update("new name", "new description");
    entity.deactivate();
    await repository.update(entity);
    const foundEntity = await repository.findById(entity.id);

    expect(entity.toJSON()).toStrictEqual(foundEntity.toJSON());
  });

  it("should throw error on delete when category is not found", async () => {
    await expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError(`fake id`, Category)
    );

    await expect(
      repository.delete(new CategoryId("e712d467-7625-437c-9803-9ba0c6b499b0"))
    ).rejects.toThrow(
      new NotFoundError(`e712d467-7625-437c-9803-9ba0c6b499b0`, Category)
    );
  });

  it("should delete a category", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);
    await repository.delete(entity.id);

    await expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(entity.id, Category)
    );
  });

  it("should not find a category by name", async () => {
    expect(await repository.exists("fake name")).toBeFalsy();
  });

  it("should find a category by name", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);
    expect(await repository.exists("some name")).toBeTruthy;
  });

  it("should return search result", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);
    const result = await repository.search(
      new CategoryRepository.SearchParams({
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "some",
      })
    );
    expect(result.items).toHaveLength(1);
  });

  describe("search method", () => {
    it("should only apply paginate when other params are null ", async () => {
      const created_at = new Date();
      const models = await CategoryModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: chance.guid({ version: 4 }),
          name: "some name",
          description: "some description",
          is_active: true,
          created_at: created_at,
        }));

      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");
      const selectedModels = models.slice(0, 15);
      const entities = selectedModels.map(
        (i) =>
          new Category(
            {
              name: i.name,
              description: i.description,
              is_active: i.is_active,
              created_at: i.created_at,
            },
            new CategoryId(i.id)
          )
      );

      const result = await repository.search(
        new CategoryRepository.SearchParams()
      );

      expect(result).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(result.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      result.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
        expect(item.toJSON()).toMatchObject({
          name: "some name",
          description: "some description",
          is_active: true,
          created_at: created_at,
        });
      });

      expect(JSON.stringify(result)).toStrictEqual(
        JSON.stringify(
          new CategoryRepository.SearchResult({
            items: entities,
            total: 16,
            current_page: 1,
            per_page: 15,
            sort: null,
            sort_dir: null,
            filter: null,
          })
        )
      );
    });

    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate((index: number) => ({
          id: chance.guid({ version: 4 }),
          name: `Movie${index}`,
          description: "some description",
          is_active: true,
          created_at: new Date(created_at.getTime() + 100 * index),
        }));

      const searchOutputActual = await repository.search(
        new CategoryRepository.SearchParams()
      );

      [...searchOutputActual.items].reverse().forEach((i, index) => {
        expect(i.name).toBe(`Movie${index + 1}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TeST")
          .withCreatedAt(new Date(new Date().getTime() + 2000))
          .build(),
      ];

      await repository.bulkInsert(categories);

      let searchOutputActual = await repository.search(
        new CategoryRepository.SearchParams({
          filter: "TEST",
          page: 1,
          per_page: 2,
        })
      );

      let searchOutputExpected = new CategoryRepository.SearchResult({
        items: [categories[0], categories[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: "TEST",
      });

      expect(searchOutputActual.toJSON()).toMatchObject(
        searchOutputExpected.toJSON()
      );

      searchOutputActual = await repository.search(
        new CategoryRepository.SearchParams({
          filter: "TEST",
          page: 2,
          per_page: 2,
        })
      );

      searchOutputExpected = new CategoryRepository.SearchResult({
        items: [categories[3]],
        total: 3,
        current_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: "TEST",
      });

      expect(searchOutputActual.toJSON()).toMatchObject(
        searchOutputExpected.toJSON()
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

      const items = [
        Category.fake().aCategory().withName("b").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("d").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("c").build(),
      ];

      await repository.bulkInsert(items);

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new CategoryRepository.SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CategoryRepository.SearchResult({
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [items[4], items[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result.toJSON()).toMatchObject(i.result.toJSON());
      }
    });

    describe("should search using filter, sort and paginate", () => {
      const categories = [
        Category.fake().aCategory().withName("test").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("TEST").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("TeSt").build(),
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      const arrange = [
        {
          search_params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),

          search_result: new CategoryRepository.SearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
        {
          search_params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
          search_result: new CategoryRepository.SearchResult({
            items: [categories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
      ];

      test.each(arrange)(
        "when search_params is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON()).toMatchObject(search_result.toJSON());
        }
      );
    });
  });
});
