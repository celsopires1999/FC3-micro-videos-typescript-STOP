import { CategoryId } from "#category/domain";
import Genre, { GenreId, GenreProperties } from "./../genre";

describe("Genre Unit Test", () => {
  beforeEach(() => {
    Genre.validate = jest.fn();
  });
  test("constructor of genre", () => {
    const categoryId = new CategoryId();
    const categoriesId = new Map<string, CategoryId>([
      [categoryId.value, categoryId],
    ]);
    let genre = new Genre({
      name: "test",
      categories_id: categoriesId,
    });
    expect(Genre.validate).toHaveBeenCalled();
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: categoriesId,
      is_active: true,
      created_at: genre.props.created_at,
    });
    expect(genre.props.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    genre = new Genre({
      name: "test",
      is_active: false,
      categories_id: categoriesId,
      created_at,
    });
    expect(Genre.validate).toHaveBeenCalledTimes(2);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: categoriesId,
      is_active: false,
      created_at,
    });

    genre = new Genre({
      name: "test",
      categories_id: categoriesId,
      is_active: true,
    });
    expect(Genre.validate).toHaveBeenCalledTimes(3);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: categoriesId,
      is_active: true,
      created_at: expect.any(Date),
    });
  });

  test("create method", () => {
    const categoryId = new CategoryId();
    let genre = Genre.create({
      name: "test",
      categories_id: [categoryId],
    });
    expect(genre).toBeInstanceOf(Genre);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: new Map<string, CategoryId>([
        [categoryId.value, categoryId],
      ]),
      is_active: true,
      created_at: expect.any(Date),
    });

    let created_at = new Date();
    genre = Genre.create({
      name: "test",
      categories_id: [categoryId.value],
      is_active: false,
      created_at,
    });
    expect(genre).toBeInstanceOf(Genre);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: expect.any(Map),
      is_active: false,
      created_at,
    });
    expect(genre.categories_id.size).toBe(1);
    expect(Array.from(genre.categories_id.keys())).toStrictEqual([
      categoryId.value,
    ]);
    expect(genre.categories_id.get(categoryId.value)).toBeInstanceOf(
      CategoryId
    );

    genre = Genre.create({
      name: "test",
      categories_id: [categoryId.value],
      is_active: true,
      created_at,
    });
    expect(genre).toBeInstanceOf(Genre);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: expect.any(Map),
      is_active: true,
      created_at,
    });
    expect(genre.categories_id.size).toBe(1);
    expect(Array.from(genre.categories_id.keys())).toStrictEqual([
      categoryId.value,
    ]);
    expect(genre.categories_id.get(categoryId.value)).toBeInstanceOf(
      CategoryId
    );
  });

  describe("id prop", () => {
    type GenreData = {
      props: GenreProperties;
      id?: GenreId;
    };

    const categoryId = new CategoryId();
    const props = {
      name: "Action",
      categories_id: new Map<string, CategoryId>([
        [categoryId.value, categoryId],
      ]),
    };
    const arrange: GenreData[] = [
      { props },
      { props, id: null },
      { props, id: undefined },
      { props, id: new GenreId() },
    ];
    test.each(arrange)("%#) when props are %j", (item) => {
      const genre = new Genre(item.props, item.id as any);
      expect(genre.id).not.toBeNull();
      expect(genre.entityId).toBeInstanceOf(GenreId);
    });
  });

  test("getter and setter of name prop", () => {
    const genre = Genre.fake().aGenre().build();
    expect(genre.name).toBe(genre.props.name);

    genre["name"] = "other name";
    expect(genre.name).toBe("other name");
  });

  test("getter and setter of categories_id prop", () => {
    let categoryId = new CategoryId();
    let categoriesId = new Map<string, CategoryId>([
      [categoryId.value, categoryId],
    ]);
    const genre = Genre.fake().aGenre().build();
    expect(genre.categories_id).toEqual(genre.props.categories_id);

    genre["categories_id"] = categoriesId;
    expect(genre.categories_id).toEqual(categoriesId);
  });

  test("setter of created_at prop", () => {
    const genre = Genre.fake().aGenre().build();
    expect(genre.created_at).toBeInstanceOf(Date);
    expect(genre.created_at).toBe(genre.props.created_at);

    const created_at = new Date();
    genre["created_at"] = created_at;
    expect(genre.created_at).toBe(created_at);
  });

  it("should update a genre", () => {
    const genre = Genre.fake().aGenre().build();
    const savedGenreProps = {
      ...genre.props,
    };
    const savedGenreId = genre.id;
    genre.update("other name");
    expect(Genre.validate).toHaveBeenCalledTimes(2);
    expect(genre.name).toBe("other name");
    expect(genre.id).toBe(savedGenreId);
    expect(genre.props).toStrictEqual({
      ...savedGenreProps,
      ...{ name: "other name" },
    });
  });

  it("should add a category id", () => {
    const genre = Genre.fake().aGenre().build();
    expect(genre.categories_id.size).toBe(1);
    const categoryId = new CategoryId();
    genre.addCategoryId(categoryId);
    expect(genre.categories_id.size).toBe(2);
    expect(genre.categories_id.has(categoryId.value)).toBeTruthy();
    expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
  });

  it("should remove a category id", () => {
    const genre = Genre.fake().aGenre().build();
    expect(genre.categories_id.size).toBe(1);
    const categoryId = new CategoryId();
    genre.addCategoryId(categoryId);
    expect(genre.categories_id.size).toBe(2);
    genre.removeCategoryId(categoryId);
    expect(genre.categories_id.size).toBe(1);
    expect(genre.categories_id.has(categoryId.value)).toBeFalsy();
  });

  it("should sync categories id", () => {
    const category_id = new CategoryId();
    const genre = Genre.fake().aGenre().withCategoryId(category_id).build();
    const categories_id = [new CategoryId(), new CategoryId()];

    expect(genre.categories_id.size).toBe(1);
    expect(genre.categories_id.get(category_id.value)).toEqual(category_id);

    genre.syncCategories(categories_id);
    expect(genre.categories_id.size).toBe(2);
    categories_id.forEach((categoryId) => {
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });

    categories_id.push(category_id);
    genre.syncCategories(categories_id);
    expect(genre.categories_id.size).toBe(3);
    categories_id.forEach((categoryId) => {
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });
  });

  it("should deactivate a genre", () => {
    const genre = Genre.fake().aGenre().build();
    expect(genre.is_active).toBeTruthy();
    genre.deactivate();
    expect(genre.is_active).toBeFalsy();
  });

  it("should activate a genre", () => {
    const genre = Genre.fake().aGenre().build();
    expect(genre.is_active).toBeTruthy();
    genre.deactivate();
    expect(genre.is_active).toBeFalsy();
    genre.activate();
    expect(genre.is_active).toBeTruthy();
  });

  it("should converte to JSON", () => {
    const genre = Genre.fake().aGenre().build();
    expect(genre.toJSON()).toEqual({
      id: genre.id,
      name: genre.name,
      categories_id: [Array.from(genre.categories_id.values())[0].value],
      is_active: genre.is_active,
      created_at: genre.created_at,
    });
  });
});
