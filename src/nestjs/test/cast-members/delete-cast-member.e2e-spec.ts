import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';
import {
  CastMember,
  CastMemberRepository,
} from '@fc/micro-videos/cast-member/domain';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-member.providers';

describe('CastMembersController (e2e)', () => {
  describe('/cast-members:id (DELETE)', () => {
    const nestApp = startApp();
    describe('should return a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '51683e7d-0842-4913-a768-f7bb0be5bfcc',
          expected: {
            message:
              'Entity not found using ID 51683e7d-0842-4913-a768-f7bb0be5bfcc',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            message: 'Validation failed (uuid v4 is expected)',
            statusCode: 422,
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('with id is $id', ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .delete(`/cast-members/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a cast member with response status 204 ', async () => {
      const castMemberRepo = nestApp.app.get<CastMemberRepository.Repository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
      const castMember = CastMember.fake().aCastMember().build();
      castMemberRepo.insert(castMember);

      await request(nestApp.app.getHttpServer())
        .delete(`/cast-members/${castMember.id}`)
        .expect(204);

      await expect(castMemberRepo.findById(castMember.id)).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${castMember.id}`),
      );
    });
  });
});
