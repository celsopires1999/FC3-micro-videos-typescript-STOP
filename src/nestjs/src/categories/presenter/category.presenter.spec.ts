import { CategoryPresenter } from './category.presenter';
import { instanceToPlain } from 'class-transformer';

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
