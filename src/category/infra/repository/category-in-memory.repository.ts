import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/in-memory-repository";
import { CategoryRepository } from "../../domain/repository/category.repository";
import Category from "../../domain/entities/category";
import { SortDirection } from "@seedwork/domain/repository/repository-contracts";

export default class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields: string[] = ["name", "created_at"];

  async exists(name: string): Promise<boolean> {
    return this.items.findIndex((item) => item.name === name) != -1;
  }

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected async applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<Category[]> {
    return !sort
      ? super.applySort(items, "created_at", "desc")
      : super.applySort(items, sort, sort_dir);
  }
}
