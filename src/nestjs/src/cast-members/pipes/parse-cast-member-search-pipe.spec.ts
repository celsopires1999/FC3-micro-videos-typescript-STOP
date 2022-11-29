import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import { SearchCastMemberClient } from '../cast-members.controller';
import { SearchCastMemberDto } from '../dto/search-cast-member.dto';
import { ParseCastMemberSearchPipe } from './parse-cast-member-search-pipe';

describe('ParseCastMemberSearchPipe', () => {
  let pipe: ParseCastMemberSearchPipe;

  beforeEach(() => {
    pipe = new ParseCastMemberSearchPipe();
  });

  describe('should convert search params', () => {
    const arrange: {
      input: SearchCastMemberClient;
      expected: SearchCastMemberDto;
    }[] = [
      {
        input: {
          name: 'a',
          type: 1,
          page: 1,
          per_page: 2,
          sort: 'name',
          sort_dir: 'a',
        },
        expected: {
          page: 1,
          per_page: 2,
          sort: 'name',
          sort_dir: 'a' as SortDirection,
          filter: { name: 'a', type: 1 },
        },
      },
      {
        input: { name: 'a', page: 1, per_page: 2, sort: 'name', sort_dir: 'a' },
        expected: {
          page: 1,
          per_page: 2,
          sort: 'name',
          sort_dir: 'a' as SortDirection,
          filter: { name: 'a' },
        },
      },
      {
        input: { page: 1, per_page: 2, sort: 'name', sort_dir: 'a' },
        expected: {
          page: 1,
          per_page: 2,
          sort: 'name',
          sort_dir: 'a' as SortDirection,
        },
      },
      {
        input: { page: 1, per_page: 2, sort: 'name' },
        expected: {
          page: 1,
          per_page: 2,
          sort: 'name',
        },
      },
      {
        input: { page: 1 },
        expected: {
          page: 1,
        },
      },
      {
        input: {},
        expected: {},
      },
    ];

    test.each(arrange)('convertion %# -> %o', ({ input, expected }) => {
      const output = pipe.transform(input, { type: 'query' });
      expect(output).toEqual(expected);
    });
  });
});
