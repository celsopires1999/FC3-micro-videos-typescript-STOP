import { Category } from '@fc/micro-videos/category/domain';

export class CategoryFixture {
  static keysInResponse() {
    return ['id', 'name', 'description', 'is_active', 'created_at'];
  }

  static arrangeForSave() {
    const name = 'Movie';
    const description = 'A good movie';
    return [
      {
        send_data: { name: name },
        expected: {
          name: name,
          description: null,
          is_active: true,
        },
      },
      {
        send_data: { name: name, description: null },
        expected: {
          name: name,
          description: null,
          is_active: true,
        },
      },
      {
        send_data: { name: name, is_active: true },
        expected: {
          name: name,
          description: null,
          is_active: true,
        },
      },
      {
        send_data: { name: name, is_active: false },
        expected: {
          name: name,
          description: null,
          is_active: false,
        },
      },
      {
        send_data: {
          name: name,
          description: description,
          is_active: true,
        },
        expected: {
          name: name,
          description: description,
          is_active: true,
        },
      },
      {
        send_data: {
          name: name,
          description: description,
          is_active: false,
        },
        expected: {
          name: name,
          description: description,
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
