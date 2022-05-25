import Category from "#category/domain/entities/category";
import { CategoryRepository } from "#category/domain/repository/category.repository";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe("CategoryInMemoryRepository Unit Tests", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  describe("exists method", () => {
    it("should return true when name exists already", async () => {
      repository.items = [new Category({ name: "movie" })];
      expect(await repository.exists("movie")).toBeTruthy();
    });
    it("should return false when name does not exist", async () => {
      repository.items = [new Category({ name: "movie" })];
      expect(await repository.exists("new movie")).toBeFalsy();
    });
  });

  describe("applyFilter method", () => {
    it("should not filter items when filter param is null", async () => {
      const items = [new Category({ name: "name value" })];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      const filteredItems = await repository["applyFilter"](items, null);
      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      const items = [
        new Category({ name: "test" }),
        new Category({ name: "TEST" }),
        new Category({ name: "fake" }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);

      let filteredItems = await repository["applyFilter"](items, "TEST");
      expect(filteredItems).toStrictEqual([filteredItems[0], filteredItems[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filteredItems = await repository["applyFilter"](items, "no-filter");
      expect(filteredItems).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);
    });
  });

  describe("applySort method", () => {
    it("should not sort items", async () => {
      const items = [new Category({ name: "b" }), new Category({ name: "a" })];
      let sortedItems = await repository["applySort"](
        items,
        "description",
        "asc"
      );
      expect(sortedItems).toStrictEqual(items);
    });

    it("should sort by created_at when sort param is null", async () => {
      const created_at = new Date();
      const items = [
        new Category({ name: "test", created_at: created_at }),
        new Category({
          name: "TEST",
          created_at: new Date(created_at.getTime() + 100),
        }),
        new Category({
          name: "fake",
          created_at: new Date(created_at.getTime() + 200),
        }),
      ];
      const sortedItems = await repository["applySort"](items, null, null);
      expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);
    });

    it("should sort items by name", async () => {
      const items = [
        new Category({ name: "b" }),
        new Category({ name: "a" }),
        new Category({ name: "c" }),
      ];
      let sortedItems = await repository["applySort"](items, "name", "asc");
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);

      sortedItems = await repository["applySort"](items, "name", "desc");
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe("search method", () => {
    it("should apply only paginate when other params are null", async () => {
      const entity = new Category({ name: "a" });
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(
        new CategoryRepository.SearchParams()
      );

      expect(JSON.stringify(result)).toStrictEqual(
        JSON.stringify(
          new CategoryRepository.SearchResult({
            items: Array(15).fill(entity),
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

    it("should apply paginate and filter - sort by created_at desc is default", async () => {
      const created_at = new Date();
      const items = [
        new Category({
          name: "test",
          created_at: new Date(created_at.getTime() + 400),
        }), // 0
        new Category({
          name: "a",
          created_at: new Date(created_at.getTime() + 300),
        }), // 1
        new Category({
          name: "TEST",
          created_at: new Date(created_at.getTime() + 200),
        }), // 2
        new Category({
          name: "TeST",
          created_at: new Date(created_at.getTime() + 100),
        }), // 3
      ];
      repository.items = items;

      const result = await repository.search(
        new CategoryRepository.SearchParams({
          filter: "TEST",
          page: 1,
          per_page: 2,
        })
      );
      expect(JSON.stringify(result)).toStrictEqual(
        JSON.stringify(
          new CategoryRepository.SearchResult({
            items: [items[0], items[2]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: "TEST",
          })
        )
      );
    });

    it("should apply paginate and sort", async () => {
      const items = [
        new Category({ name: "b" }), // 0
        new Category({ name: "a" }), // 1
        new Category({ name: "d" }), // 2
        new Category({ name: "e" }), // 3
        new Category({ name: "c" }), // 4
      ];
      repository.items = items;

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
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
            sort_dir: "asc",
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
        const result = await repository.search(i.params);
        expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(i.result));
      }
    });

    it("should search using filter, sort and paginate", async () => {
      const items = [
        new Category({ name: "test" }), // 0
        new Category({ name: "a" }), // 1
        new Category({ name: "TEST" }), // 2
        new Category({ name: "e" }), // 3
        new Category({ name: "TeSt" }), // 4
      ];
      repository.items = items;

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
          result: new CategoryRepository.SearchResult({
            items: [items[2], items[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
          result: new CategoryRepository.SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(i.result));
      }
    });
  });
});
