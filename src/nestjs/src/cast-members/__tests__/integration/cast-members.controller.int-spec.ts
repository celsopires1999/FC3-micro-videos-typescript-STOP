import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';
import {
  CreateCastMemberUseCase,
  DeleteCastMemberUseCase,
  GetCastMemberUseCase,
  ListCastMembersUseCase,
  UpdateCastMemberUseCase,
} from '@fc/micro-videos/cast-member/application';
import {
  CastMember,
  CastMemberRepository,
} from '@fc/micro-videos/cast-member/domain';
import { Test, TestingModule } from '@nestjs/testing';
import { CastMembersModule } from './../../../cast-members/cast-members.module';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './../../../cast-members/presenter/cast-member.presenter';
import { ConfigModule } from './../../../config/config.module';
import { DatabaseModule } from './../../../database/database.module';
import { CastMembersController } from './../../cast-members.controller';
import { CAST_MEMBER_PROVIDERS } from '../../cast-member.providers';
import {
  CastMemberFixture,
  ListCastMembersFixture,
  UpdateCastMemberFixture,
} from './../../fixtures';

describe('CastMembersController Integration Tests', () => {
  let controller: CastMembersController;
  let repository: CastMemberRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CastMembersModule],
    }).compile();

    controller = module.get(CastMembersController);
    repository = module.get(
      CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_SEQUELIZE_REPOSITORY
        .provide,
    );
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCastMemberUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCastMemberUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCastMemberUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(
      GetCastMemberUseCase.UseCase,
    );
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCastMembersUseCase.UseCase,
    );
  });
  describe('should create a cast member', () => {
    const arrange = CastMemberFixture.arrangeForSave();

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(presenter.id);

        expect(entity.toJSON()).toStrictEqual({
          id: presenter.id,
          created_at: presenter.created_at,
          ...expected,
        });

        expect(presenter).toEqual(new CastMemberPresenter(entity.toJSON()));
      },
    );
  });

  describe('should update a cast member', () => {
    const arrange = UpdateCastMemberFixture.arrangeForSave();
    test.each(arrange)(
      'with send data $send_data',
      async ({ send_data, expected }) => {
        const entity = CastMember.fake().aCastMember().build();
        await repository.insert(entity);

        const presenter = await controller.update(entity.id, send_data);
        const foundEntity = await repository.findById(entity.id);

        expect(foundEntity.toJSON()).toMatchObject({
          id: presenter.id,
          created_at: presenter.created_at,
          ...expected,
        });

        const expectedPresenter = CastMembersController.castMemberToResponse(
          foundEntity.toJSON(),
        );
        expect(presenter).toEqual(expectedPresenter);
      },
    );
  });

  it('should delete a cast member', async () => {
    const entity = CastMember.fake().aCastMember().build();
    await repository.insert(entity);
    const response = await controller.remove(entity.id);
    expect(response).toBeUndefined();
    expect(repository.findById(entity.id)).rejects.toThrowError(
      new NotFoundError(`Entity not found using ID ${entity.id}`),
    );
  });
  it('should find a cast member', async () => {
    const entity = CastMember.fake().aCastMember().build();
    await repository.insert(entity);
    const expectedPresenter = CastMembersController.castMemberToResponse(
      entity.toJSON(),
    );
    const presenter = await controller.findOne(entity.id);
    expect(presenter).toStrictEqual(expectedPresenter);
    expect(presenter.id).toBe(entity.id);
    expect(presenter.name).toBe(expectedPresenter.name);
    expect(presenter.type).toBe(expectedPresenter.type);
    expect(presenter.created_at).toStrictEqual(entity.created_at);
  });
  describe('search method', () => {
    describe('should return presenter with cast members ordered by created_at when query is empty', () => {
      const { arrange, entitiesMap } =
        ListCastMembersFixture.arrangeIncrementedWithCreatedAt();
      const entities = Object.values(entitiesMap);

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          await repository.bulkInsert(entities);
          const presenter = await controller.search(send_data);
          expect(presenter).toEqual(
            new CastMemberCollectionPresenter(expected),
          );
        },
      );
    });

    describe('should return output using paginate, sort and filter', () => {
      const { arrange, entitiesMap } = ListCastMembersFixture.arrangeUnsorted();
      const items = Object.values(entitiesMap);

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          await repository.bulkInsert(items);
          const presenter = await controller.search(send_data as any);
          expect(presenter).toEqual(
            new CastMemberCollectionPresenter(expected),
          );
        },
      );
    });
  });
});
