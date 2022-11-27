import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import {
  CastMember,
  CastMemberType,
} from '@fc/micro-videos/cast-member/domain';

export class CastMemberFixture {
  static keysInResponse() {
    return ['id', 'name', 'type', 'created_at'];
  }

  static arrangeForSave() {
    const faker = CastMember.fake()
      .aCastMember()
      .withName('John Doe')
      .withType(CastMemberType.createDirector())
      .build();
    return [
      {
        send_data: { name: faker.name, type: faker.type.code },
        expected: {},
      },
    ];
  }

  static arrangeInvalidRequest() {
    const faker = CastMember.fake().aCastMember();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return [
      {
        label: 'EMPTY',
        send_data: { type: faker.type.code },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      {
        label: 'NAME UNDEFINED',
        send_data: {
          name: faker.withInvalidNameEmpty(undefined).name,
          type: faker.type.code,
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
          type: faker.type.code,
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
          type: faker.type.code,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
    ];
  }

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().aCastMember();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return [
      {
        label: 'EMPTY',
        send_data: { type: faker.type.code },
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
          type: faker.type.code,
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
          type: faker.type.code,
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
          type: faker.type.code,
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
          type: faker.type.code,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
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
    return CastMemberFixture.arrangeInvalidRequest();
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
    const faker = CastMember.fake().aCastMember();

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
          filter: 'a',
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
          filter: 'a',
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
          filter: 'a',
        },
        expected: {
          items: [entitiesMap.AAA.toJSON()],
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
