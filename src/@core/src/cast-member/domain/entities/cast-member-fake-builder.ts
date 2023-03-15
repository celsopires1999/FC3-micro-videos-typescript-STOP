import { Chance } from "chance";
import { CastMemberType, Types } from "../value-objects/cast-member-type.vo";
import { CastMember, CastMemberId } from "./cast-member";

type PropOrFactory<T> = T | ((index: number) => T);

export class CastMemberFakeBuilder<TBuild = any> {
  private _entity_id = undefined; // auto generated in entity
  private _name: PropOrFactory<string> = (index) => this.chance.word();
  private _type: PropOrFactory<CastMemberType> = (index) =>
    CastMemberType.create(
      this.chance.integer({ min: 1, max: 2 }) as Types
    ).getOk();
  private _created_at = undefined; // auto generated in entity

  private countObjs: number;

  static aCastMember() {
    return new CastMemberFakeBuilder<CastMember>();
  }

  static theCastMembers(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs);
  }

  static anActor() {
    return CastMemberFakeBuilder.aCastMember().withType(
      CastMemberType.createAnActor()
    );
  }

  static aDirector() {
    return CastMemberFakeBuilder.aCastMember().withType(
      CastMemberType.createADirector()
    );
  }

  private chance: Chance.Chance;

  private constructor(countObjs = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withEntityId(valueOrFactory: PropOrFactory<CastMemberId>) {
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

  withType(valueOrFactory: PropOrFactory<CastMemberType>) {
    this._type = valueOrFactory;
    return this;
  }

  withInvalidTypeEmpty(value: "" | null | undefined) {
    this._type = value as any;
    return this;
  }

  withInvalidTypeNotACastMemberType(value: any = "fake cast member type") {
    this._type = value;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new CastMember(
          {
            name: this.callFactory(this._name, index),
            type: this.callFactory(this._type, index),
            ...(this._created_at && {
              created_at: this.callFactory(this._created_at, index),
            }),
          },
          this._entity_id && this.callFactory(this._entity_id, index)
        )
    );

    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  get entity_id(): CastMemberId {
    return this.getValue("entity_id");
  }

  get name(): string {
    return this.getValue("name");
  }

  get type(): CastMemberType {
    return this.getValue("type");
  }

  get created_at(): Date {
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
