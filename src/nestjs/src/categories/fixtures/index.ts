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
}
