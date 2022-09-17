import { UniqueEntityId } from "#seedwork/domain";
import { Chance } from "chance";
import { Category } from "./category";

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private unique_entity_id = undefined; // auto generated in entity
  private name: PropOrFactory<string> = (index) => this.chance.word();
  private description: PropOrFactory<string | null> = (index) =>
    this.chance.paragraph();
  private is_active: PropOrFactory<boolean> = (index) => true;
  private created_at = undefined; // auto generated in entity

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

  withUniqueEntityId(valueOrFactory: PropOrFactory<UniqueEntityId>) {
    this.unique_entity_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this.name = valueOrFactory;
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

  withDescription(vaueOrFactory: PropOrFactory<string | null>) {
    this.description = vaueOrFactory;
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

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this.created_at = valueOrFactory;
    return this;
  }

  // build(): TBuild {
  //   const categories = new Array(this.countObjs).fill(undefined).map(
  //     (_, index) =>
  //       new Category({
  //         ...(this.unique_entity_id && {
  //           unique_entity_id: this.callFactory(this.unique_entity_id, index),
  //         }),
  //         name: this.callFactory(this.name, index),
  //         description: this.callFactory(this.description, index),
  //         is_active: this.callFactory(this.is_active, index),
  //         ...(this.created_at && {
  //           created_at: this.callFactory(this.created_at, index),
  //         }),
  //       })
  //   );

  //   return this.countObjs === 1 ? (categories[0] as any) : categories;
  // }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new Category(
          {
            name: this.callFactory(this.name, index),
            description: this.callFactory(this.description, index),
            is_active: this.callFactory(this.is_active, index),
            ...(this.created_at && {
              created_at: this.callFactory(this.created_at, index),
            }),
          },
          this.unique_entity_id &&
            this.callFactory(this.unique_entity_id, index)
        )
    );

    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  private callFactory(propOrFactory: PropOrFactory<any>, index: number) {
    return typeof propOrFactory === "function"
      ? propOrFactory(index)
      : propOrFactory;
  }
}
