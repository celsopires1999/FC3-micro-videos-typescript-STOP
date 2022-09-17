import { Chance } from "chance";
import { Category } from "./category";

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private name: PropOrFactory<string> = (index) => this.chance.word();
  private description: PropOrFactory<string | null> = (index) =>
    this.chance.paragraph();
  private is_active: PropOrFactory<boolean> = (index) => true;

  private countObjs: number;

  static aCategory() {
    return new CategoryFakeBuilder<Category>();
  }

  static theCategories(countObjs: number) {
    return new CategoryFakeBuilder<Category[]>(countObjs);
  }

  private chance: Chance.Chance;

  constructor(countObjs = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withName(name: PropOrFactory<string>) {
    this.name = name;
    return this;
  }

  withInvalidNameEmpty(value: "" | null | undefined) {
    this.name = value;
    return this;
  }

  withInvalidNameNotAString(value: any = 5) {
    this.name = value;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this.name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withDescription(description: PropOrFactory<string | null>) {
    this.description = description;
    return this;
  }

  withInvalidDescriptionNotAString(value: any = 5) {
    this.description = value;
    return this;
  }

  activate() {
    this.is_active = true;
    return this;
  }

  deactivate() {
    this.is_active = false;
    return this;
  }

  withInvalidIsActiveEmpty(value: "" | null | undefined) {
    this.is_active = value as any;
    return this;
  }

  withInvalidIsActiveNotABoolean(value: any = "fake boolean") {
    this.is_active = value;
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new Category({
          name: this.callFactory(this.name, index),
          description: this.callFactory(this.description, index),
          is_active: this.callFactory(this.is_active, index),
        })
    );

    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  private callFactory(propOrFactory: PropOrFactory<any>, index: number) {
    return typeof propOrFactory === "function"
      ? propOrFactory(index)
      : propOrFactory;
  }
}
