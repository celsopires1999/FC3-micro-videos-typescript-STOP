import { CastMemberRepository } from '@fc/micro-videos/cast-member/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-member.providers';
import { ListCastMembersFixture } from '../../src/cast-members/fixtures';
import { CastMemberCollectionPresenter } from '../../src/cast-members/presenter/cast-member.presenter';

describe('CastMembersController (e2e)', () => {
  describe('/cast-members (GET)', () => {
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
        'with send data: $send_data',
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
        'with send data: $send_data',
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
  });
});
