import Entity from "../../../@seedwork/domain/entity/entity";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import CastMemberValidatorFactory from "../validators/cast-member.validator";
import { CastMemberFakeBuilder } from "./cast-member-fake-builder";
import CastMemberType from "./cast-member-type.vo";

export type CastMemberProperties = {
  name: string;
  type: CastMemberType;
  created_at?: Date;
};

export type CastMemberPropsJson = Required<
  { id: string } & CastMemberProperties
>;

export class CastMember extends Entity<
  CastMemberProperties,
  CastMemberPropsJson
> {
  constructor(
    public readonly props: CastMemberProperties,
    id?: UniqueEntityId
  ) {
    CastMember.validate(props);
    super(props, id);
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
    CastMember.validate({ name, type });
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
      name: this.name,
      type: this.type,
      created_at: this.created_at,
    };
  }

  static fake() {
    return CastMemberFakeBuilder;
  }
}

export default CastMember;
