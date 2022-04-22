import Category, { CategoryProperties } from "./category";
import { omit } from "lodash";
import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.vo";

describe("Category Unit Test", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });
  test("constructor of category", () => {
    let category = new Category({
      name: "Movie",
    });
    let props = omit(category.props, "created_at");
    expect(Category.validate).toHaveBeenCalled();
    expect(props).toStrictEqual({
      name: "Movie",
      description: null,
      is_active: true,
    });

    let created_at = new Date();
    category = new Category({
      name: "Movie",
      description: "some description",
      is_active: false,
      created_at,
    });
    expect(category.props).toStrictEqual({
      name: "Movie",
      description: "some description",
      is_active: false,
      created_at,
    });

    category = new Category({
      name: "Movie",
      description: "other description",
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      description: "other description",
    });

    category = new Category({
      name: "Movie",
      is_active: true,
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      is_active: true,
    });

    created_at = new Date();
    category = new Category({
      name: "Movie",
      created_at,
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      created_at,
    });
  });

  test("id prop", () => {
    type CategoryData = {
      props: CategoryProperties;
      id?: UniqueEntityId;
    };
    const data: CategoryData[] = [
      { props: { name: "Movie" } },
      { props: { name: "Movie" }, id: null },
      { props: { name: "Movie" }, id: undefined },
      { props: { name: "Movie" }, id: new UniqueEntityId() },
    ];
    data.forEach((i) => {
      const category = new Category(i.props, i.id as any);
      expect(category.id).not.toBeNull();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    });
  });

  test("getter and setter of name prop", () => {
    const category = new Category({ name: "Movie" });
    expect(category.name).toBe("Movie");

    category["name"] = "Other movie";
    expect(category.name).toBe("Other movie");
  });

  test("getter and setter of description prop", () => {
    let categorie = new Category({
      name: "Movie",
    });
    expect(categorie.description).toBeNull();

    categorie = new Category({
      name: "Movie",
      description: "some description",
    });
    expect(categorie.description).toBe("some description");

    categorie = new Category({
      name: "Movie",
    });
    categorie["description"] = "other description";
    expect(categorie.description).toBe("other description");

    categorie["description"] = undefined;
    expect(categorie.description).toBeNull;

    categorie["description"] = null;
    expect(categorie.description).toBeNull;
  });

  test("getter and setter of is_active prop", () => {
    let category = new Category({
      name: "Movie",
    });
    expect(category.is_active).toBeTruthy();

    category = new Category({
      name: "Movie",
      is_active: true,
    });
    expect(category.is_active).toBeTruthy();

    category = new Category({
      name: "Movie",
      is_active: false,
    });
    expect(category.is_active).toBeFalsy();

    category["is_active"] = false;
    expect(category.is_active).toBeFalsy();

    category["is_active"] = true;
    expect(category.is_active).toBeTruthy();

    category["is_active"] = undefined;
    expect(category.is_active).toBeTruthy();

    category["is_active"] = null;
    expect(category.is_active).toBeTruthy();
  });

  test("setter of created_at prop", () => {
    const created_at = new Date();
    let category = new Category({
      name: "Movie",
      created_at,
    });
    expect(category.created_at).toBe(created_at);

    category = new Category({
      name: "Movie",
    });
    expect(category.created_at).toBeInstanceOf(Date);
  });

  it("should update a category", () => {
    const category = new Category({
      name: "Movie",
      description: "Some description",
    });
    const created_at = category.created_at;

    category.update("Other movie", "Other description");
    expect(Category.validate).toHaveBeenCalledTimes(2);
    expect(category.name).toBe("Other movie");
    expect(category.description).toBe("Other description");
    expect(category.props).toStrictEqual({
      name: "Other movie",
      description: "Other description",
      created_at,
      is_active: true,
    });
  });

  it("should activate a category", () => {
    const category = new Category({ name: "Movie", is_active: false });
    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  it("should deactivate a category", () => {
    const category = new Category({ name: "Movie", is_active: true });
    category.deactivate();
    expect(category.is_active).toBeFalsy();
  });
});
