import { Chance } from "chance";
import { Category, CategoryId } from "./category";

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private _entity_id = undefined; // auto generated in entity
  private _name: PropOrFactory<string> = (index) => this.chance.word();
  private _description: PropOrFactory<string | null> = (index) =>
    this.chance.paragraph();
  private _is_active: PropOrFactory<boolean> = (index) => true;
  private _created_at = undefined; // auto generated in entity

  private countObjs: number;

  static aCategory() {
    return new CategoryFakeBuilder<Category>();
  }

  static theCategories(countObjs: number) {
    return new CategoryFakeBuilder<Category[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withEntityId(valueOrFactory: PropOrFactory<CategoryId>) {
    this._entity_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withInvalidNameEmpty(value: "" | null | undefined) {
    this._name = value;
    return this;
  }

  withInvalidNameNotAString(value: any = 5) {
    this._name = value;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withDescription(vaueOrFactory: PropOrFactory<string | null>) {
    this._description = vaueOrFactory;
    return this;
  }

  withInvalidDescriptionNotAString(value: any = 5) {
    this._description = value;
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  withInvalidIsActiveEmpty(value: "" | null | undefined) {
    this._is_active = value as any;
    return this;
  }

  withInvalidIsActiveNotABoolean(value: any = "fake boolean") {
    this._is_active = value;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new Category(
          {
            name: this.callFactory(this._name, index),
            description: this.callFactory(this._description, index),
            is_active: this.callFactory(this._is_active, index),
            ...(this._created_at && {
              created_at: this.callFactory(this._created_at, index),
            }),
          },
          this._entity_id && this.callFactory(this._entity_id, index)
        )
    );

    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  get entity_id() {
    return this.getValue("entity_id");
  }

  get name() {
    return this.getValue("name");
  }

  get description() {
    return this.getValue("description");
  }

  get is_active() {
    return this.getValue("is_active");
  }

  get created_at() {
    return this.getValue("created_at");
  }

  private getValue(prop: string) {
    const optional = ["entity_id", "created_at"];
    const privateProp = `_${prop}`;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} does not have a factory, use "with" method instead`
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(propOrFactory: PropOrFactory<any>, index: number) {
    return typeof propOrFactory === "function"
      ? propOrFactory(index)
      : propOrFactory;
  }
}
