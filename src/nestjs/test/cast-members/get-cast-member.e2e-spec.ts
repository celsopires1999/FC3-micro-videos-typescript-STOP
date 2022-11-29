import {
  CastMember,
  CastMemberRepository,
} from '@fc/micro-videos/cast-member/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CastMembersController } from '../../src/cast-members/cast-members.controller';
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-member.providers';
import { CastMemberFixture } from '../../src/cast-members/fixtures';

describe('CastMembersController (e2e)', () => {
  describe('/cast-members:id (GET)', () => {
    const nestApp = startApp();
    describe('should give a response error with 422/404 when id is invalid or not found', () => {
      const arrange = [
        {
          label: 'INVALID',
          id: 'fake id',
          expected: {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: 'Validation failed (uuid v4 is expected)',
          },
        },
        {
          label: 'NOT FOUND',
          id: 'd0ba5077-fb6d-406f-bd05-8c521ba9425a',
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'Entity not found using ID d0ba5077-fb6d-406f-bd05-8c521ba9425a',
          },
        },
      ];
      test.each(arrange)('id contents: $label', ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/cast-members/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should get a cast member', async () => {
      const castMemberRepo = nestApp.app.get<CastMemberRepository.Repository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
      const createdCastMember = CastMember.fake().aCastMember().build();
      castMemberRepo.insert(createdCastMember);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/cast-members/${createdCastMember.id}`)
        .expect(200);
      const keysInResponse = CastMemberFixture.keysInResponse();
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

      const presenter = CastMembersController.castMemberToResponse(
        createdCastMember.toJSON(),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
