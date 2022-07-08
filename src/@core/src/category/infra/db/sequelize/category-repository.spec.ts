import { Category, CategoryRepository } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CategoryModel } from "./category-model";
import CategorySequelizeRepository from "./category-repository";
import { CategoryModelMapper } from "#category/infra";
import _chance from "chance";

const chance = _chance();

describe("CategorySequelizeRepository Unit Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  let repository: CategorySequelizeRepository;
  // let chance: Chance.Chance;

  // beforeAll(() => {
  //   chance = _chance();
  // });

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
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

  it("should return all categories", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toStrictEqual(JSON.stringify([entity]));
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
            new UniqueEntityId(i.id)
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
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "test", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TeST", ...defaultProps },
      ];

      const categories = await CategoryModel.bulkCreate(categoriesProps);

      let searchOutputActual = await repository.search(
        new CategoryRepository.SearchParams({
          filter: "TEST",
          page: 1,
          per_page: 2,
        })
      );

      let searchOutputExpected = new CategoryRepository.SearchResult({
        items: [
          CategoryModelMapper.toEntity(categories[0]),
          CategoryModelMapper.toEntity(categories[2]),
        ],
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
        items: [CategoryModelMapper.toEntity(categories[3])],
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
      const defaultProps = {
        description: "some description",
        is_active: true,
        created_at: new Date(),
      };
      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "b", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "d", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "e", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "c", ...defaultProps },
      ];

      const models = await CategoryModel.bulkCreate(categoriesProps);
      const items = models.map((model) => CategoryModelMapper.toEntity(model));

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
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "test", ...defaultProps }, // 0
        { id: chance.guid({ version: 4 }), name: "a", ...defaultProps }, // 1
        { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps }, // 2
        { id: chance.guid({ version: 4 }), name: "e", ...defaultProps }, // 3
        { id: chance.guid({ version: 4 }), name: "TeSt", ...defaultProps }, // 4
      ];

      beforeEach(async () => {
        await CategoryModel.bulkCreate(categoriesProps);
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
            items: [
              new Category(categoriesProps[2]),
              new Category(categoriesProps[4]),
            ],
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
            items: [new Category(categoriesProps[0])],
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
