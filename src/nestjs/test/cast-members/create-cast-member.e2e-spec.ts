import { CastMemberRepository } from '@fc/micro-videos/cast-member/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CastMembersController } from '../../src/cast-members/cast-members.controller';
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-member.providers';

import { CreateCastMemberFixture } from '../../src/cast-members/fixtures';

describe('CastMembersController (e2e)', () => {
  describe('/cast-members (POST)', () => {
    describe('should give a response error with 422 when request body is invalid', () => {
      const nestApp = startApp();
      const arrange = CreateCastMemberFixture.arrangeInvalidRequest();
      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(nestApp.app.getHttpServer())
          .post('/cast-members')
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should give a response error with 422 when throw EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });
      const arrange = CreateCastMemberFixture.arrangeForEntityValidationError();
      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(app.app.getHttpServer())
          .post('/cast-members')
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should create a cast member', () => {
      const nestApp = startApp();
      const arrange = CreateCastMemberFixture.arrangeForSave();
      let castMemberRepo: CastMemberRepository.Repository;

      beforeEach(async () => {
        castMemberRepo = nestApp.app.get<CastMemberRepository.Repository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(nestApp.app.getHttpServer())
            .post('/cast-members')
            .send(send_data)
            .expect(201);
          const keysInResponse = CreateCastMemberFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.id;
          const castMember = await castMemberRepo.findById(id);

          const presenter = CastMembersController.castMemberToResponse(
            castMember.toJSON(),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual(serialized);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
