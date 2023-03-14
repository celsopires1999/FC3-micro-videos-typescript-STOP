import Entity from "../../../@seedwork/domain/entity/entity";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import CategoryValidatorFactory from "../validators/category.validator";
import { CategoryFakeBuilder } from "./category-fake-builder";

export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

export type CategoryPropsJson = Required<{ id: string } & CategoryProperties>;

export class Category extends Entity<
  UniqueEntityId,
  CategoryProperties,
  CategoryPropsJson
> {
  constructor(
    public readonly props: CategoryProperties,
    entityId?: UniqueEntityId
  ) {
    Category.validate(props);
    super(props, entityId ?? new UniqueEntityId());
    this.description = this.props.description;
    this.is_active = this.props.is_active;
    this.created_at = this.props.created_at;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get description(): string {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
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

  update(name: string, description: string) {
    Category.validate({ name, description });
    this.name = name;
    this.description = description;
  }

  static validate(props: CategoryProperties) {
    const validator = CategoryValidatorFactory.create();
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

  toJSON(): CategoryPropsJson {
    return {
      id: this.id.toString(),
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }

  static fake() {
    return CategoryFakeBuilder;
  }
}

export default Category;
