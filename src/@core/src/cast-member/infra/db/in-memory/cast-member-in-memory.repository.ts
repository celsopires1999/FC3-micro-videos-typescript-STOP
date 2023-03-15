import { SortDirection } from "@seedwork/domain/repository/repository-contracts";
import { InMemorySearchableRepository } from "../../../../@seedwork/domain/repository/in-memory-repository";
import CastMember, { CastMemberId } from "../../../domain/entities/cast-member";
import { CastMemberRepository } from "../../../domain/repository/cast-member.repository";

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberRepository.Filter
  >
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
    return items.filter((i) => {
      const firstClause =
        filter.name &&
        i.props.name.toLowerCase().includes(filter.name.toLowerCase());
      const secondClause = filter.type && i.props.type.equals(filter.type);
      return filter.name && filter.type
        ? firstClause && secondClause
        : filter.name
        ? firstClause
        : secondClause;
    });
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
