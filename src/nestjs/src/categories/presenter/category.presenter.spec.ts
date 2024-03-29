import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../@share/presenters/pagination.presenter';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './category.presenter';

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: '03e32ea9-27ba-4806-b20e-a8eed3abf342',
        name: 'some name',
        description: 'some description',
        is_active: true,
        created_at,
      });

      expect(presenter.id).toBe('03e32ea9-27ba-4806-b20e-a8eed3abf342');
      expect(presenter.name).toBe('some name');
      expect(presenter.description).toBe('some description');
      expect(presenter.is_active).toBeTruthy();
      expect(presenter.created_at).toStrictEqual(created_at);
    });

    it('should present data', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: '03e32ea9-27ba-4806-b20e-a8eed3abf342',
        name: 'some name',
        description: 'some description',
        is_active: true,
        created_at,
      });
      const data = instanceToPlain(presenter);
      expect(data).toStrictEqual({
        id: '03e32ea9-27ba-4806-b20e-a8eed3abf342',
        name: 'some name',
        description: 'some description',
        is_active: true,
        created_at: created_at.toISOString(),
      });
    });
  });
});

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const item = {
        id: '1c117595-7878-48c6-8e5b-fc525e9fe5ee',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      };
      const presenter = new CategoryCollectionPresenter({
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
      expect(presenter.data).toStrictEqual([new CategoryPresenter(item)]);
    });
  });

  it('should present data', () => {
    const item = {
      id: '1c117595-7878-48c6-8e5b-fc525e9fe5ee',
      name: 'movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    let presenter = new CategoryCollectionPresenter({
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
          description: item.description,
          is_active: item.is_active,
          created_at: item.created_at.toISOString(),
        },
      ],
    });

    presenter = new CategoryCollectionPresenter({
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
          description: item.description,
          is_active: item.is_active,
          created_at: item.created_at.toISOString(),
        },
      ],
    });
  });
});
