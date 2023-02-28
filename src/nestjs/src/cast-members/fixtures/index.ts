import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import { CastMember, Types } from '@fc/micro-videos/cast-member/domain';

export class CastMemberFixture {
  static keysInResponse() {
    return ['id', 'name', 'type', 'created_at'];
  }

  static arrangeForSave() {
    return [
      {
        send_data: { name: 'John Doe', type: Types.DIRECTOR },
        expected: { name: 'John Doe', type: Types.DIRECTOR },
      },
      {
        send_data: { name: 'Mary Doe', type: Types.ACTOR },
        expected: { name: 'Mary Doe', type: Types.ACTOR },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const faker = CastMember.fake().aCastMember();
    const name = faker.name;
    const type = faker.type.value;
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return [
      {
        label: 'BODY EMPTY',
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'type should not be empty',
            'type must be an integer number',
            'type must be one of the following values: 1, 2',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME UNDEFINED',
        send_data: {
          name: undefined,
          type,
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
          type,
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
          type,
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
          type,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
      {
        label: 'TYPE UNDEFINED',
        send_data: {
          name,
          type: undefined,
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
            'type must be one of the following values: 1, 2',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'TYPE EMPTY',
        send_data: {
          name,
          type: faker.withInvalidTypeEmpty(''),
        },
        expected: {
          message: [
            'type must be an integer number',
            'type must be one of the following values: 1, 2',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'TYPE INVALID',
        send_data: {
          name,
          type: faker.withInvalidTypeNotACastMemberType('fake'),
        },
        expected: {
          message: [
            'type must be an integer number',
            'type must be one of the following values: 1, 2',
          ],
          ...defaultExpected,
        },
      },
    ];
  }

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().aCastMember();
    const name = faker.name;
    const type = faker.type.value;
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return [
      {
        label: 'BODY EMPTY',
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'Invalid cast member type: undefined',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME UNDEFINED',
        send_data: {
          name: undefined,
          type,
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
          type,
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
          type,
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
          type,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
      {
        label: 'TYPE UNDEFINED',
        send_data: {
          name,
          type: undefined,
        },
        expected: {
          message: ['Invalid cast member type: undefined'],
          ...defaultExpected,
        },
      },
      {
        label: 'TYPE EMPTY',
        send_data: {
          name,
          type: faker.withInvalidTypeEmpty('').type,
        },
        expected: {
          message: ['Invalid cast member type: '],
          ...defaultExpected,
        },
      },
      {
        label: 'TYPE INVALID',
        send_data: {
          name,
          type: faker.withInvalidTypeNotACastMemberType('fake').type,
        },
        expected: {
          message: ['Invalid cast member type: fake'],
          ...defaultExpected,
        },
      },
    ];
  }
}

export class CreateCastMemberFixture {
  static keysInResponse() {
    return CastMemberFixture.keysInResponse();
  }

  static arrangeForSave() {
    return CastMemberFixture.arrangeForSave();
  }

  static arrangeInvalidRequest() {
    return CastMemberFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    return CastMemberFixture.arrangeForEntityValidationError();
  }
}

export class UpdateCastMemberFixture {
  static keysInResponse() {
    return CastMemberFixture.keysInResponse();
  }

  static arrangeForSave() {
    return CastMemberFixture.arrangeForSave();
  }

  static arrangeInvalidRequest() {
    const removeTests = ['NAME TOO LONG'];
    const tests = CastMemberFixture.arrangeInvalidRequest();

    return tests.filter((test) => {
      if (!removeTests.includes(test.label)) {
        return test;
      }
    });
  }

  static arrangeForEntityValidationError() {
    const removeTests = [];
    const tests = CastMemberFixture.arrangeForEntityValidationError();

    return tests.filter((test) => {
      if (!removeTests.includes(test.label)) {
        return test;
      }
    });
  }
}

export class ListCastMembersFixture {
  static arrangeIncrementedWithCreatedAt() {
    const entities = CastMember.fake()
      .theCastMembers(4)
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
            entitiesMap.fourth.toJSON(),
            entitiesMap.third.toJSON(),
            entitiesMap.second.toJSON(),
            entitiesMap.first.toJSON(),
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
          items: [entitiesMap.fourth.toJSON(), entitiesMap.third.toJSON()],
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
          items: [entitiesMap.second.toJSON(), entitiesMap.first.toJSON()],
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
    const entitiesMap = {
      a: CastMember.fake().anActor().withName('a').build(),
      AAA: CastMember.fake().aDirector().withName('AAA').build(),
      AaA: CastMember.fake().aDirector().withName('AaA').build(),
      b: CastMember.fake().anActor().withName('b').build(),
      c: CastMember.fake().anActor().withName('c').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: { name: 'a' },
        },
        expected: {
          items: [entitiesMap.AAA.toJSON(), entitiesMap.AaA.toJSON()],
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
          filter: { name: 'a' },
        },
        expected: {
          items: [entitiesMap.a.toJSON()],
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
          filter: { name: 'a' },
        },
        expected: {
          items: [entitiesMap.a.toJSON(), entitiesMap.AaA.toJSON()],
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
          filter: { name: 'a' },
        },
        expected: {
          items: [entitiesMap.AAA.toJSON()],
          total: 3,
          current_page: 2,
          last_page: 2,
          per_page: 2,
        },
      },
      //
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          sort_dir: 'desc' as SortDirection,
          filter: { type: 2 },
        },
        expected: {
          items: [entitiesMap.c.toJSON(), entitiesMap.b.toJSON()],
          total: 3,
          current_page: 1,
          last_page: 2,
          per_page: 2,
        },
      },
      //
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          sort_dir: 'desc' as SortDirection,
          filter: { name: 'aa', type: 1 },
        },
        expected: {
          items: [entitiesMap.AaA.toJSON(), entitiesMap.AAA.toJSON()],
          total: 2,
          current_page: 1,
          last_page: 1,
          per_page: 2,
        },
      },
      //
    ];

    return { arrange, entitiesMap };
  }
}
