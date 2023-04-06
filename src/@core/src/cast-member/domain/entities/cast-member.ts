import AggregateRoot from "#seedwork/domain/entity/aggregate-root";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import CastMemberValidatorFactory from "../validators/cast-member.validator";
import { CastMemberType, Types } from "../value-objects/cast-member-type.vo";
import { CastMemberFakeBuilder } from "./cast-member-fake-builder";

export type CastMemberProperties = {
  name: string;
  type: CastMemberType;
  created_at?: Date;
};

export type CastMemberPropsJson = Required<
  { id: string } & Omit<CastMemberProperties, "type">
> & { type: Types };

export class CastMemberId extends UniqueEntityId {}

export class CastMember extends AggregateRoot<
  CastMemberId,
  CastMemberProperties,
  CastMemberPropsJson
> {
  constructor(
    public readonly props: CastMemberProperties,
    entityId?: CastMemberId
  ) {
    CastMember.validate(props);
    super(props, entityId ?? new CastMemberId());
    this.type = this.props.type;
    this.created_at = this.props.created_at;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get type(): CastMemberType {
    return this.props.type;
  }

  private set type(value: CastMemberType) {
    this.props.type = value;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  private set created_at(value: Date) {
    const date = value ?? new Date();
    this.props.created_at = date;
  }

  update(name: string, type: CastMemberType) {
    CastMember.validate({
      ...this.props,
      name,
      type,
    });
    this.name = name;
    this.type = type;
  }

  static validate(props: CastMemberProperties) {
    const validator = CastMemberValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON(): CastMemberPropsJson {
    return {
      id: this.id.toString(),
      ...this.props,
      type: this.type.value,
    } as CastMemberPropsJson;
  }

  static fake() {
    return CastMemberFakeBuilder;
  }
}

export default CastMember;
