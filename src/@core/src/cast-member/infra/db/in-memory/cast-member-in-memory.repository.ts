import { InMemorySearchableRepository } from "../../../../@seedwork/domain/repository/in-memory-repository";
import { CastMemberRepository } from "../../../domain/repository/cast-member.repository";
import CastMember from "../../../domain/entities/cast-member";
import { SortDirection } from "@seedwork/domain/repository/repository-contracts";

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<CastMember, CastMemberRepository.Filter>
  implements CastMemberRepository.Repository
{
  sortableFields: string[] = ["name", "created_at"];

  async exists(name: string): Promise<boolean> {
    return this.items.findIndex((item) => item.name === name) != -1;
  }

  protected async applyFilter(
    items: CastMember[],
    filter: CastMemberRepository.Filter
  ): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }

    items = this.applyFilterName(items, filter.name);
    return this.applyFilterType(items, filter.type);
  }

  private applyFilterName(items: CastMember[], name: string): CastMember[] {
    if (!name) {
      return items;
    }
    return items.filter((i) => {
      return i.props.name.toLowerCase().includes(name.toLowerCase());
    });
  }

  private applyFilterType(items: CastMember[], type: number): CastMember[] {
    if (!type) {
      return items;
    }
    return items.filter((i) => i.props.type.code === type);
  }

  protected async applySort(
    items: CastMember[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<CastMember[]> {
    return !sort
      ? super.applySort(items, "created_at", "desc")
      : super.applySort(items, sort, sort_dir);
  }
}

export default CastMemberInMemoryRepository;
