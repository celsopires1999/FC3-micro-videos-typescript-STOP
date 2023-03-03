import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import { Category } from '@fc/micro-videos/category/domain';

export class CategoryFixture {
  static keysInResponse() {
    return ['id', 'name', 'description', 'is_active', 'created_at'];
  }

  static arrangeForSave() {
    const faker = Category.fake()
      .aCategory()
      .withName('Movie')
      .withDescription('A good movie')
      .build();
    return [
      {
        send_data: { name: faker.name, description: null, is_active: true },
        expected: {
          name: faker.name,
          description: null,
          is_active: true,
        },
      },
      {
        send_data: { name: faker.name, description: null, is_active: true },
        expected: {
          name: faker.name,
          description: null,
          is_active: true,
        },
      },
      {
        send_data: { name: faker.name, description: null, is_active: true },
        expected: {
          name: faker.name,
          description: null,
          is_active: true,
        },
      },
      {
        send_data: { name: faker.name, description: null, is_active: false },
        expected: {
          name: faker.name,
          description: null,
          is_active: false,
        },
      },
      {
        send_data: {
          name: faker.name,
          description: faker.description,
          is_active: true,
        },
        expected: {
          name: faker.name,
          description: faker.description,
          is_active: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          description: faker.description,
          is_active: false,
        },
        expected: {
          name: faker.name,
          description: faker.description,
          is_active: false,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return [
      {
        label: 'EMPTY',
        send_data: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME UNDEFINED',
        send_data: {
          name: faker.withInvalidNameEmpty(undefined).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME NULL',
        send_data: {
          name: faker.withInvalidNameEmpty(null).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME EMPTY',
        send_data: {
          name: faker.withInvalidNameEmpty('').name,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      {
        label: 'DESCRIPTION NOT A STRING',
        send_data: {
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'IS_ACTIVE EMPTY',
        send_data: {
          is_active: faker.withInvalidIsActiveEmpty('').is_active,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'IS_ACTIVE NOT A BOOLEAN',
        send_data: {
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    ];
  }

  static arrangeForEntityValidationError() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return [
      {
        label: 'EMPTY',
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME UNDEFINED',
        send_data: {
          name: faker.withInvalidNameEmpty(undefined).name,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME NULL',
        send_data: {
          name: faker.withInvalidNameEmpty(null).name,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME EMPTY',
        send_data: {
          name: faker.withInvalidNameEmpty('').name,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME TOO LONG',
        send_data: {
          name: faker.withInvalidNameTooLong().name,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
      {
        label: 'DESCRIPTION NOT A STRING',
        send_data: {
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'IS_ACTIVE EMPTY',
        send_data: {
          is_active: faker.withInvalidIsActiveEmpty('').is_active,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'IS_ACTIVE NOT A BOOLEAN',
        send_data: {
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    ];
  }
}

export class CreateCategoryFixture {
  static keysInResponse() {
    return CategoryFixture.keysInResponse();
  }

  static arrangeForSave() {
    return CategoryFixture.arrangeForSave();
  }

  static arrangeInvalidRequest() {
    return CategoryFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    return CategoryFixture.arrangeForEntityValidationError();
  }
}

export class UpdateCategoryFixture {
  static keysInResponse() {
    return CategoryFixture.keysInResponse();
  }

  static arrangeForSave() {
    return CategoryFixture.arrangeForSave();
  }

  static arrangeInvalidRequest() {
    return CategoryFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    const removeTests = ['IS_ACTIVE EMPTY', 'IS_ACTIVE NOT A BOOLEAN'];
    const tests = CategoryFixture.arrangeForEntityValidationError();

    return tests.filter((test) => {
      if (!removeTests.includes(test.label)) {
        return test;
      }
    });
  }
}

export class ListCategoriesFixture {
  static arrangeIncrementedWithCreatedAt() {
    const entities = Category.fake()
      .theCategories(4)
      .withName((index) => `teste ${index}`)
      .withCreatedAt((index) => new Date(new Date().getTime() + index * 1000))
      .build();

    const entitiesMap = {
      first: entities[0],
      second: entities[1],
      third: entities[2],
      fourth: entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          items: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 4,
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          items: [entitiesMap.fourth, entitiesMap.third],
          current_page: 1,
          last_page: 2,
          per_page: 2,
          total: 4,
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          items: [entitiesMap.second, entitiesMap.first],
          current_page: 2,
          last_page: 2,
          per_page: 2,
          total: 4,
        },
      },
      {
        send_data: {
          page: 99,
          per_page: 2,
        },
        expected: {
          items: [],
          current_page: 99,
          last_page: 2,
          per_page: 2,
          total: 4,
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = Category.fake().aCategory();

    const entitiesMap = {
      a: faker.withName('a').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      b: faker.withName('b').build(),
      c: faker.withName('c').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          items: [entitiesMap.AAA, entitiesMap.AaA],
          total: 3,
          current_page: 1,
          last_page: 2,
          per_page: 2,
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          items: [entitiesMap.a],
          total: 3,
          current_page: 2,
          last_page: 2,
          per_page: 2,
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          sort_dir: 'desc' as SortDirection,
          filter: 'a',
        },
        expected: {
          items: [entitiesMap.a, entitiesMap.AaA],
          total: 3,
          current_page: 1,
          last_page: 2,
          per_page: 2,
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          sort_dir: 'desc' as SortDirection,
          filter: 'a',
        },
        expected: {
          items: [entitiesMap.AAA],
          total: 3,
          current_page: 2,
          last_page: 2,
          per_page: 2,
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
