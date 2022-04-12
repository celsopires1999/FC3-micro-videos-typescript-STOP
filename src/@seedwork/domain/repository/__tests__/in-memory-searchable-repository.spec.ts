import Entity from "../../entity/entity";
import { InMemorySearchableRepository } from "../in-memory-repository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ["name"];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return (
        i.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.props.price.toString() === filter
      );
    });
  }
}

describe("InMemorySearchableRepository Unit Tests", () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => (repository = new StubInMemorySearchableRepository()));

  describe("applyFilter method", () => {
    it("should not filter items when filter param is null", async () => {
      const items = [new StubEntity({ name: "name value", price: 5 })];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      const filteredItems = await repository["applyFilter"](items, null);
      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "fake", price: 0 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);

      let filteredItems = await repository["applyFilter"](items, "TEST");
      expect(filteredItems).toStrictEqual([filteredItems[0], filteredItems[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filteredItems = await repository["applyFilter"](items, "5");
      expect(filteredItems).toStrictEqual([filteredItems[0], filteredItems[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      filteredItems = await repository["applyFilter"](items, "no-filter");
      expect(filteredItems).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe("applySort method", () => {
    it("should not sort items", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
      ];
      let sortedItems = await repository["applySort"](items, null, null);
      expect(sortedItems).toStrictEqual(items);

      sortedItems = await repository["applySort"](items, "price", "asc");
      expect(sortedItems).toStrictEqual(items);
    });

    it("should sort items", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
      ];
      let sortedItems = await repository["applySort"](items, "name", "asc");
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);

      sortedItems = await repository["applySort"](items, "name", "desc");
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe("applyPaginate method", () => {
    it("should paginate items", async () => {
      const items = [
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
        new StubEntity({ name: "d", price: 5 }),
        new StubEntity({ name: "e", price: 5 }),
      ];

      let paginatedItems = await repository["applyPaginate"](items, 1, 2);
      expect(paginatedItems).toStrictEqual([items[0], items[1]]);

      paginatedItems = await repository["applyPaginate"](items, 2, 2);
      expect(paginatedItems).toStrictEqual([items[2], items[3]]);

      paginatedItems = await repository["applyPaginate"](items, 3, 2);
      expect(paginatedItems).toStrictEqual([items[4]]);

      paginatedItems = await repository["applyPaginate"](items, 4, 2);
      expect(paginatedItems).toStrictEqual([]);
    });
  });

  describe("search method", () => {});
});
