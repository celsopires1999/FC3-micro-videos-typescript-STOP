import { CategoryId } from "#category/domain";
import { Genre, GenreFakeBuilder, GenreRepository } from "#genre/domain";
import { GenreInMemoryRepository } from "#genre/infra";

describe("GenreInMemoryRepository Unit Tests", () => {
  let repository: GenreInMemoryRepository;

  beforeEach(() => (repository = new GenreInMemoryRepository()));

  describe("exists method", () => {
    it("should return true when name exists already", async () => {
      repository.items = [GenreFakeBuilder.aGenre().withName("Terror").build()];
      expect(await repository.exists("Terror")).toBeTruthy();
    });
    it("should return false when name does not exist", async () => {
      repository.items = [GenreFakeBuilder.aGenre().withName("Terror").build()];
      expect(await repository.exists("Drama")).toBeFalsy();
    });
  });

  describe("applyFilter method", () => {
    it("should not filter items when filter param is null", async () => {
      const items = [
        Genre.fake().aGenre().build(),
        Genre.fake().aGenre().build(),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      const filteredItems = await repository["applyFilter"](items, null);
      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      const faker = Genre.fake().aGenre();
      const items = [
        faker.withName("test").build(),
        faker.withName("TEST").build(),
        faker.withName("fake").build(),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);

      let filteredItems = await repository["applyFilter"](items, {
        name: "TEST",
      });
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filteredItems = await repository["applyFilter"](items, {
        name: "no-filter",
      });
      expect(filteredItems).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);
    });

    it("should filter items by categories_id", async () => {
      const categoryId1 = new CategoryId();
      const categoryId2 = new CategoryId();
      const categoryId3 = new CategoryId();
      const categoryId4 = new CategoryId();
      const items = [
        Genre.fake()
          .aGenre()
          .withCategoryId(categoryId1)
          .withCategoryId(categoryId2)
          .build(),
        Genre.fake()
          .aGenre()
          .withCategoryId(categoryId3)
          .withCategoryId(categoryId4)
          .build(),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);

      let filteredItems = await repository["applyFilter"](items, {
        categories_id: [categoryId1],
      });
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
      expect(filteredItems).toStrictEqual([items[0]]);

      filteredItems = await repository["applyFilter"](items, {
        categories_id: [categoryId2],
      });
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);
      expect(filteredItems).toStrictEqual([items[0]]);

      filteredItems = await repository["applyFilter"](items, {
        categories_id: [categoryId1, categoryId2],
      });
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
      expect(filteredItems).toStrictEqual([items[0]]);

      filteredItems = await repository["applyFilter"](items, {
        categories_id: [categoryId1, categoryId3],
      });
      expect(spyFilterMethod).toHaveBeenCalledTimes(4);
      expect(filteredItems).toStrictEqual([...items]);
    });

    it("should filter items by name and categories_id", async () => {
      const categoryId1 = new CategoryId();
      const categoryId2 = new CategoryId();
      const categoryId3 = new CategoryId();
      const categoryId4 = new CategoryId();
      const items = [
        Genre.fake()
          .aGenre()
          .withName("test")
          .withCategoryId(categoryId1)
          .withCategoryId(categoryId2)
          .build(),
        Genre.fake()
          .aGenre()
          .withName("fake")
          .withCategoryId(categoryId3)
          .withCategoryId(categoryId4)
          .build(),

        Genre.fake()
          .aGenre()
          .withName("test fake")
          .withCategoryId(categoryId1)
          .build(),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);

      let filteredItems = await repository["applyFilter"](items, {
        name: "test",
        categories_id: [categoryId1],
      });
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
      expect(filteredItems).toStrictEqual([items[0], items[2]]);

      filteredItems = await repository["applyFilter"](items, {
        name: "test",
        categories_id: [categoryId3],
      });
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);
      expect(filteredItems).toStrictEqual([]);

      filteredItems = await repository["applyFilter"](items, {
        name: "fake",
        categories_id: [categoryId4],
      });
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
      expect(filteredItems).toStrictEqual([items[1]]);
    });
  });

  describe("applySort method", () => {
    it("should not sort items", async () => {
      const faker = GenreFakeBuilder.aGenre();
      const items = [faker.withName("b").build(), faker.withName("a").build()];
      let sortedItems = await repository["applySort"](
        items,
        "description",
        "asc"
      );
      expect(sortedItems).toStrictEqual(items);
    });

    it("should sort by created_at when sort param is null", async () => {
      const created_at = new Date();
      const faker = GenreFakeBuilder.aGenre();
      const items = [
        faker.withName("test").withCreatedAt(created_at).build(),
        faker
          .withName("TEST")
          .withCreatedAt(new Date(created_at.getTime() + 1000))
          .build(),
        faker
          .withName("fake")
          .withCreatedAt(new Date(created_at.getTime() + 2000))
          .build(),
      ];
      const sortedItems = await repository["applySort"](items, null, null);
      expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);
    });

    it("should sort items by name", async () => {
      const faker = GenreFakeBuilder.aGenre();
      const items = [
        faker.withName("b").build(),
        faker.withName("a").build(),
        faker.withName("c").build(),
      ];
      let sortedItems = await repository["applySort"](items, "name", "asc");
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);

      sortedItems = await repository["applySort"](items, "name", "desc");
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe("search method", () => {
    it("should apply only paginate when other params are null", async () => {
      const entity = GenreFakeBuilder.aGenre().withName("a").build();
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(
        GenreRepository.SearchParams.create()
      );

      expect(JSON.stringify(result)).toStrictEqual(
        JSON.stringify(
          new GenreRepository.SearchResult({
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
      const faker = GenreFakeBuilder.aGenre();
      const items = [
        faker
          .withName("test")
          .withCreatedAt(new Date(created_at.getTime() + 400))
          .build(), // 0
        faker
          .withName("a")
          .withCreatedAt(new Date(created_at.getTime() + 300))
          .build(), // 1
        faker
          .withName("TEST")
          .withCreatedAt(new Date(created_at.getTime() + 200))
          .build(), // 2
        faker
          .withName("TeST")
          .withCreatedAt(new Date(created_at.getTime() + 100))
          .build(), // 3
      ];
      repository.items = items;

      const result = await repository.search(
        GenreRepository.SearchParams.create({
          filter: { name: "TEST" },
          page: 1,
          per_page: 2,
        })
      );
      expect(JSON.stringify(result)).toStrictEqual(
        JSON.stringify(
          new GenreRepository.SearchResult({
            items: [items[0], items[2]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: { name: "TEST" },
          })
        )
      );
    });

    it("should apply paginate and sort", async () => {
      const faker = GenreFakeBuilder.aGenre();
      const items = [
        faker.withName("b").build(), // 0
        faker.withName("a").build(), // 1
        faker.withName("d").build(), // 2
        faker.withName("e").build(), // 3
        faker.withName("c").build(), // 4
      ];
      repository.items = items;

      const arrange = [
        {
          params: GenreRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
          }),
          result: new GenreRepository.SearchResult({
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
          params: GenreRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
          }),
          result: new GenreRepository.SearchResult({
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
          params: GenreRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new GenreRepository.SearchResult({
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
          params: GenreRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new GenreRepository.SearchResult({
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
      const faker = GenreFakeBuilder.aGenre();
      const items = [
        faker.withName("test").build(), // 0
        faker.withName("a").build(), // 1
        faker.withName("TEST").build(), // 2
        faker.withName("e").build(), // 3
        faker.withName("TeSt").build(), // 4
      ];
      repository.items = items;

      const arrange = [
        {
          params: GenreRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
          }),
          result: new GenreRepository.SearchResult({
            items: [items[2], items[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
          }),
        },
        {
          params: GenreRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
          }),
          result: new GenreRepository.SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
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
