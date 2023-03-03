import {
  CastMember,
  CastMemberRepository,
} from '@fc/micro-videos/cast-member/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CastMembersController } from '../../src/cast-members/cast-members.controller';
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-member.providers';
import { UpdateCastMemberFixture } from '../../src/cast-members/fixtures';

describe('CastMembersController (e2e)', () => {
  const uuid = '4b1f1c5e-67d8-4142-a286-fae0b1d6032a';

  describe('/cast-members:id (PUT)', () => {
    describe('should give a response error with 422 when request body is invalid', () => {
      const nestApp = startApp();
      const arrange = UpdateCastMemberFixture.arrangeInvalidRequest();
      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(nestApp.app.getHttpServer())
          .put(`/cast-members/${uuid}`)
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should give a response error with 422 when throw EntityValidationError', () => {
      const nestApp = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });
      const arrange = UpdateCastMemberFixture.arrangeForEntityValidationError();
      let categoryRepo: CastMemberRepository.Repository;

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CastMemberRepository.Repository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });

      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        const category = CastMember.fake().aCastMember().build();
        categoryRepo.insert(category);
        return request(nestApp.app.getHttpServer())
          .put(`/cast-members/${category.id}`)
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should give a response error with 422/404 when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = CastMember.fake().aCastMember();
      const arrange = [
        {
          label: 'INVALID',
          id: 'fake id',
          send_data: { name: faker.name, type: faker.type.value },
          expected: {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: 'Validation failed (uuid v4 is expected)',
          },
        },
        {
          label: 'NOT FOUND',
          id: 'd0ba5077-fb6d-406f-bd05-8c521ba9425a',
          send_data: { name: faker.name, type: faker.type.value },
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'Entity not found using ID d0ba5077-fb6d-406f-bd05-8c521ba9425a',
          },
        },
      ];
      test.each(arrange)(
        'id contents: $label',
        ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .put(`/cast-members/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should update a cast member', () => {
      const nestApp = startApp();
      const arrange = UpdateCastMemberFixture.arrangeForSave();
      let categoryRepo: CastMemberRepository.Repository;
      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CastMemberRepository.Repository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const createdCastMember = CastMember.fake().aCastMember().build();
          categoryRepo.insert(createdCastMember);
          const res = await request(nestApp.app.getHttpServer())
            .put(`/cast-members/${createdCastMember.id}`)
            .send(send_data)
            .expect(200);
          const keysInResponse = UpdateCastMemberFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.id;
          const updatedCastMember = await categoryRepo.findById(id);

          const presenter = CastMembersController.castMemberToResponse(
            updatedCastMember.toJSON(),
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
