import { SortDirection } from "@seedwork/domain/repository/repository-contracts";
import { InMemorySearchableRepository } from "../../../../@seedwork/domain/repository/in-memory-repository";
import Genre, { GenreId } from "../../../domain/entities/genre";
import { GenreRepository } from "../../../domain/repository/genre.repository";

export class GenreInMemoryRepository
  extends InMemorySearchableRepository<Genre, GenreId, GenreRepository.Filter>
  implements GenreRepository.Repository
{
  getEntity(): new (...args: any[]) => Genre {
    return Genre;
  }

  sortableFields: string[] = ["name", "created_at"];

  async exists(name: string): Promise<boolean> {
    return this.items.findIndex((item) => item.name === name) != -1;
  }

  protected async applyFilter(
    items: Genre[],
    filter: GenreRepository.Filter
  ): Promise<Genre[]> {
    if (!filter) {
      return items;
    }
    return items.filter((i) => {
      const containsName =
        filter.name &&
        i.props.name.toLowerCase().includes(filter.name.toLowerCase());
      const containsCategoriesId =
        filter.categories_id &&
        filter.categories_id.some((c) => i.props.categories_id.has(c.value));
      return filter.name && filter.categories_id
        ? containsName && containsCategoriesId
        : filter.name
        ? containsName
        : containsCategoriesId;
    });
  }

  protected async applySort(
    items: Genre[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<Genre[]> {
    return !sort
      ? super.applySort(items, "created_at", "desc")
      : super.applySort(items, sort, sort_dir);
  }
}

export default GenreInMemoryRepository;
