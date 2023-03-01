import { CastMemberRepository } from '@fc/micro-videos/cast-member/domain';
import { instanceToPlain } from 'class-transformer';
import qs from 'qs';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-member.providers';
import { ListCastMembersFixture } from '../../src/cast-members/fixtures';
import { CastMemberCollectionPresenter } from '../../src/cast-members/presenter/cast-member.presenter';

describe('CastMembersController (e2e)', () => {
  describe('/cast-members (GET)', () => {
    describe('should return a response error when type is invalid', () => {
      const nestApp = startApp();
      const arrange = [
        {
          label: 'INVALID',
          send_data: {
            type: 'invalid',
          },
          expected: {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: ['Invalid cast member type: invalid'],
          },
        },
      ];
      test.each(arrange)('send data: $label', ({ send_data, expected }) => {
        const queryParams = qs.stringify(send_data);
        return request(nestApp.app.getHttpServer())
          .get(`/cast-members/?${queryParams}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    describe('should return cast members ordered by created_at when query is empty', () => {
      let categoryRepo: CastMemberRepository.Repository;
      const nestApp = startApp();
      const { arrange, entitiesMap } =
        ListCastMembersFixture.arrangeIncrementedWithCreatedAt();
      const entities = Object.values(entitiesMap);

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CastMemberRepository.Repository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
        await categoryRepo.bulkInsert(entities);
      });

      test.each(arrange)(
        'when query_params is {page: $send_data.page, per_page: $send_data.per_page}',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          const res = await request(nestApp.app.getHttpServer())
            .get(`/cast-members?${queryParams}`)
            .expect(200);
          expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
          const presenter = new CastMemberCollectionPresenter(expected);
          const serialized = instanceToPlain(presenter);
          expect(res.body).toEqual(serialized);
        },
      );
    });

    describe('should return cast members using paginate, sort and filter', () => {
      let categoryRepo: CastMemberRepository.Repository;
      const nestApp = startApp();
      const { arrange, entitiesMap } = ListCastMembersFixture.arrangeUnsorted();
      const entities = Object.values(entitiesMap);

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CastMemberRepository.Repository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
        await categoryRepo.bulkInsert(entities);
      });

      test.each(arrange)(
        'when query_params is {filter: $send_data.filter, sort: $send_data.sort, page: $send_data.page, per_page: $send_data.per_page}',
        async ({ send_data, expected }) => {
          const params = {
            ...(send_data?.page && { page: send_data.page }),
            ...(send_data?.per_page && { per_page: send_data.per_page }),
            ...(send_data?.sort && { sort: send_data.sort }),
            ...(send_data?.sort_dir && { sort_dir: send_data.sort_dir }),
            ...(send_data?.filter?.name && { name: send_data.filter.name }),
            ...(send_data?.filter?.type && { type: send_data.filter.type }),
          };

          const queryParams = new URLSearchParams(params as any).toString();
          const res = await request(nestApp.app.getHttpServer())
            .get(`/cast-members?${queryParams}`)
            .expect(200);
          expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
          const presenter = new CastMemberCollectionPresenter(expected);
          const serialized = instanceToPlain(presenter);
          expect(res.body).toEqual(serialized);
        },
      );
    });
  });
});
