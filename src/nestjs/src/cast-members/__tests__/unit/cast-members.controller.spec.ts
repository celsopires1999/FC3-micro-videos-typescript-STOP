import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import {
  CreateCastMemberUseCase,
  GetCastMemberUseCase,
  ListCastMembersUseCase,
  UpdateCastMemberUseCase,
} from '@fc/micro-videos/cast-member/application';
import { Types } from '@fc/micro-videos/cast-member/domain';
import { CastMembersController } from './../../cast-members.controller';
import { CreateCastMemberDto } from './../../dto/create-cast-member.dto';
import { UpdateCastMemberDto } from './../../dto/update-cast-member.dto';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './../../presenter/cast-member.presenter';

describe('CastMembersController Unit Tests', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    controller = new CastMembersController();
  });

  it('should create a cast member', async () => {
    const output: CreateCastMemberUseCase.Output = {
      id: '312cffad-1938-489e-a706-643dc9a3cfd3',
      name: 'John Doe',
      type: Types.DIRECTOR,
      created_at: new Date(),
    };

    const expectedPresenter =
      CastMembersController.castMemberToResponse(output);

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedPresenter)),
    };

    //@ts-expect-error mock for testing
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateCastMemberDto = {
      name: 'John Doe',
      type: Types.DIRECTOR,
    };

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(expectedPresenter);
  });

  it('should update a cast member', async () => {
    const id = '312cffad-1938-489e-a706-643dc9a3cfd3';
    const output: UpdateCastMemberUseCase.Output = {
      id,
      name: 'updated category',
      type: Types.DIRECTOR,
      created_at: new Date(),
    };

    const expectedPresenter =
      CastMembersController.castMemberToResponse(output);

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedPresenter)),
    };

    //@ts-expect-error mock for testing
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateCastMemberDto = {
      name: 'Mary Doe',
      type: Types.ACTOR,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(expectedPresenter);
  });

  it('should delete a cast member', async () => {
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(undefined)),
    };

    //@ts-expect-error mock for testing
    controller['deleteUseCase'] = mockDeleteUseCase;

    const id = '312cffad-1938-489e-a706-643dc9a3cfd3';
    expect(controller.remove(id)).toBeInstanceOf(Promise);

    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toBeUndefined();
  });

  it('should list a cast member', async () => {
    const id = '312cffad-1938-489e-a706-643dc9a3cfd3';
    const output: GetCastMemberUseCase.Output = {
      id,
      name: 'John Doe',
      type: Types.DIRECTOR,
      created_at: new Date(),
    };

    const expectedPresenter =
      CastMembersController.castMemberToResponse(output);

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedPresenter)),
    };

    //@ts-expect-error mock for testing
    controller['getUseCase'] = mockGetUseCase;

    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toStrictEqual(expectedPresenter);
  });

  it('should list cast members', async () => {
    const id = '312cffad-1938-489e-a706-643dc9a3cfd3';
    const output: ListCastMembersUseCase.Output = {
      items: [
        {
          id,
          name: 'John Doe',
          type: Types.DIRECTOR,
          created_at: new Date(),
        },
      ],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 1,
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error mock for testing
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort_dir: 'desc' as SortDirection,
      filter: { name: 'John Doe', type: Types.DIRECTOR },
    };

    const presenter = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toBeInstanceOf(CastMemberCollectionPresenter);
    expect(presenter).toStrictEqual(new CastMemberCollectionPresenter(output));
  });
});
