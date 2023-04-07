import { CategoryId } from "#category/domain";
import { Chance } from "chance";
import { Genre, GenreId } from "./genre";

type PropOrFactory<T> = T | ((index: number) => T);

export class GenreFakeBuilder<TBuild = any> {
  private _entity_id = undefined; // auto generated in entity
  private _name: PropOrFactory<string> = (_index) => this.chance.word();
  private _is_active: PropOrFactory<boolean> = (_index) => true;
  private _categories_id: PropOrFactory<CategoryId>[] = [];
  private _created_at = undefined; // auto generated in entity

  private countObjs: number;

  static aGenre() {
    return new GenreFakeBuilder<Genre>();
  }

  static theGenres(countObjs: number) {
    return new GenreFakeBuilder<Genre[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withEntityId(valueOrFactory: PropOrFactory<GenreId>) {
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

  withCategoryId(valueOrFactory: PropOrFactory<CategoryId>) {
    this._categories_id.push(valueOrFactory);
    return this;
  }

  withInvalidCategoryId() {
    this._categories_id.push("fake id" as any);
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
    const genres = new Array(this.countObjs).fill(undefined).map((_, index) =>
      Genre.create(
        {
          name: this.callFactory(this._name, index),
          categories_id: this._categories_id.length
            ? this.callFactory(this._categories_id, index)
            : [new CategoryId()],
          is_active: this.callFactory(this._is_active, index),
          ...(this._created_at && {
            created_at: this.callFactory(this._created_at, index),
          }),
        },
        !this._entity_id ? undefined : this.callFactory(this._entity_id, index)
      )
    );

    return this.countObjs === 1 ? (genres[0] as any) : genres;
  }

  get entity_id() {
    return this.getValue("entity_id");
  }

  get name() {
    return this.getValue("name");
  }

  get categories_id() {
    return this.getValue("categories_id");
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
