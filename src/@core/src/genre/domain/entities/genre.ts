import { CategoryId } from "#category/domain";
import AggregateRoot from "#seedwork/domain/entity/aggregate-root";
import { cloneDeep } from "lodash";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import GenreValidatorFactory from "../validators/genre.validator";
import { GenreFakeBuilder } from "./genre-fake-builder";

export type GenreProperties = {
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active?: boolean;
  created_at?: Date;
};

export type GenreCreateCommand = Omit<GenreProperties, "categories_id"> & {
  categories_id: string[] | CategoryId[];
};

export type GenrePropsJson = Required<
  { id: string } & Omit<GenreProperties, "categories_id"> & {
      categories_id: string[];
    }
>;

export class GenreId extends UniqueEntityId {}

export class Genre extends AggregateRoot<
  GenreId,
  GenreProperties,
  GenrePropsJson
> {
  constructor(public readonly props: GenreProperties, entityId?: GenreId) {
    Genre.validate(props);
    super(props, entityId ?? new GenreId());
    this.is_active = this.props.is_active;
    this.created_at = this.props.created_at;
  }

  static create(props: GenreCreateCommand, id?: GenreId) {
    const categories_id = new Map<string, CategoryId>();
    props.categories_id.forEach((categoryId) => {
      categories_id.set(
        categoryId instanceof CategoryId ? categoryId.value : categoryId,
        categoryId instanceof CategoryId
          ? categoryId
          : new CategoryId(categoryId)
      );
    });
    return new Genre({ ...props, categories_id }, id);
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get categories_id() {
    return this.props.categories_id;
  }

  private set categories_id(value: Map<string, CategoryId>) {
    this.props.categories_id = value;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  private set created_at(value: Date) {
    const date = value ?? new Date();
    this.props.created_at = date;
  }

  update(name: string) {
    Genre.validate({
      ...this.props,
      name,
    });
    this.name = name;
  }

  addCategoryId(categoryId: CategoryId) {
    const categoriesId = cloneDeep(this.props.categories_id);
    categoriesId.set(categoryId.value, categoryId);

    Genre.validate({
      ...this.props,
      categories_id: categoriesId,
    });

    this.categories_id = categoriesId;
  }

  removeCategoryId(categoryId: CategoryId) {
    const categoriesId = cloneDeep(this.props.categories_id);
    categoriesId.delete(categoryId.value);

    Genre.validate({
      ...this.props,
      categories_id: categoriesId,
    });

    this.categories_id = categoriesId;
  }

  updateCategoriesId(newCategoriesId: CategoryId[]) {
    if (!Array.isArray(newCategoriesId) || !newCategoriesId.length) {
      return;
    }

    const categoriesId = new Map<string, CategoryId>();
    newCategoriesId.forEach((id) => categoriesId.set(id.value, id));

    Genre.validate({
      ...this.props,
      categories_id: categoriesId,
    });

    this.categories_id = categoriesId;
  }

  syncCategories(newCategoriesId: CategoryId[]) {
    if (!newCategoriesId.length) {
      return;
    }

    const categoriesId = cloneDeep(this.props.categories_id);

    categoriesId.forEach((categoryId) => {
      const notExists = !newCategoriesId.find((newCategoryId) =>
        newCategoryId.equals(categoryId)
      );
      if (notExists) {
        categoriesId.delete(categoryId.value);
      }
    });

    newCategoriesId.forEach((categoryId) =>
      categoriesId.set(categoryId.value, categoryId)
    );
    Genre.validate({
      ...this.props,
      categories_id: categoriesId,
    });

    this.categories_id = categoriesId;
  }

  static validate(props: GenreProperties) {
    const validator = GenreValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  toJSON(): GenrePropsJson {
    return {
      id: this.id.toString(),
      name: this.name,
      categories_id: Array.from(this.props.categories_id.values()).map(
        (categoryId) => categoryId.value
      ),
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }

  static fake() {
    return GenreFakeBuilder;
  }
}

export default Genre;
