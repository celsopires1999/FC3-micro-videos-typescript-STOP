import { SearchResult } from "../../domain/repository/repository-contracts";
import { PaginationOutputMapper } from "./pagination-output";

describe("PaginationOutputMapper Unit Tests", () => {
  it("should convert SearchResult into output", () => {
    const result = new SearchResult({
      items: ["fake"] as any,
      current_page: 1,
      per_page: 2,
      total: 1,
      sort: "name",
      sort_dir: "desc",
      filter: "fake",
    });

    const output = PaginationOutputMapper.toOutput(result);

    expect(output).toStrictEqual({
      items: ["fake"],
      current_page: 1,
      last_page: 1,
      per_page: 2,
      total: 1,
    });
  });
});
