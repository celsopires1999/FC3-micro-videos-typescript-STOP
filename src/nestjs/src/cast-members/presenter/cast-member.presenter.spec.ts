import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../@share/presenters/pagination.presenter';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './cast-member.presenter';

describe('CastMemberPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CastMemberPresenter({
        id: '03e32ea9-27ba-4806-b20e-a8eed3abf342',
        name: 'John Doe',
        type: 1,
        created_at,
      });

      expect(presenter.id).toBe('03e32ea9-27ba-4806-b20e-a8eed3abf342');
      expect(presenter.name).toBe('John Doe');
      expect(presenter.type).toBe(1);
      expect(presenter.created_at).toStrictEqual(created_at);
    });

    it('should present data', () => {
      const created_at = new Date();
      const presenter = new CastMemberPresenter({
        id: '03e32ea9-27ba-4806-b20e-a8eed3abf342',
        name: 'John Doe',
        type: 1,
        created_at,
      });
      const data = instanceToPlain(presenter);
      expect(data).toStrictEqual({
        id: '03e32ea9-27ba-4806-b20e-a8eed3abf342',
        name: 'John Doe',
        type: 1,
        created_at: created_at.toISOString(),
      });
    });
  });
});

describe('CastMemberCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const item = {
        id: '1c117595-7878-48c6-8e5b-fc525e9fe5ee',
        name: 'John Doe',
        type: 1,
        created_at,
      };
      const presenter = new CastMemberCollectionPresenter({
        items: [item],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        }),
      );
      expect(presenter.data).toStrictEqual([new CastMemberPresenter(item)]);
    });
  });

  it('should present data', () => {
    const item = {
      id: '1c117595-7878-48c6-8e5b-fc525e9fe5ee',
      name: 'John Doe',
      type: 1,
      created_at: new Date(),
    };
    let presenter = new CastMemberCollectionPresenter({
      items: [item],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: item.id,
          name: item.name,
          type: item.type,
          created_at: item.created_at.toISOString(),
        },
      ],
    });

    presenter = new CastMemberCollectionPresenter({
      items: [item],
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: item.id,
          name: item.name,
          type: item.type,
          created_at: item.created_at.toISOString(),
        },
      ],
    });
  });
});
