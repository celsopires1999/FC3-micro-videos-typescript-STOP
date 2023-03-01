import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { SearchCastMemberDto } from '../dto/search-cast-member.dto';

export type SearchCastMemberClient = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: string;
  name?: string;
  type?: number;
};

@Injectable()
export class ParseCastMemberSearchPipe
  implements PipeTransform<SearchCastMemberClient, SearchCastMemberDto>
{
  transform(
    value: SearchCastMemberClient,
    metadata: ArgumentMetadata,
  ): SearchCastMemberDto {
    let filter = undefined;

    if (value?.name || value?.type) {
      if (value?.type && !isNaN(+value.type)) {
        value.type = +value.type;
      }
      filter = {
        ...(value?.name && { name: value.name }),
        ...(value?.type && { type: value.type }),
      };
    }

    return {
      ...(value?.page && { page: value?.page }),
      ...(value?.per_page && { per_page: value?.per_page }),
      ...(value?.sort && { sort: value?.sort }),
      ...(value?.sort_dir && { sort_dir: value?.sort_dir as SortDirection }),
      ...(filter && { filter: { ...filter } }),
    };
  }
}
