import { Either } from "#seedwork/domain/utils/either";
import ValueObject from "#seedwork/domain/value-objects/value-object";
import { InvalidCastMemberTypeError } from "../errors/cast-member-type.error";

const Types = {
  DIRECTOR: 1,
  ACTOR: 2,
} as const;

type ObjectValues<T> = T[keyof T];
type Types = ObjectValues<typeof Types>;
const TYPES_OPTIONS = Object.values(Types);

class CastMemberType extends ValueObject<Types> {
  private constructor(value: Types) {
    super(value);
    this.validate();
  }

  static create(
    value: Types
  ): Either<CastMemberType, InvalidCastMemberTypeError> {
    try {
      return Either.ok(new CastMemberType(value));
    } catch (error) {
      return Either.fail(error);
    }
  }

  private validate() {
    const isValid = TYPES_OPTIONS.includes(this.value);
    if (!isValid) {
      throw new InvalidCastMemberTypeError(this.value);
    }
  }

  static createADirector() {
    return CastMemberType.create(Types.DIRECTOR).getOk();
  }

  static createAnActor() {
    return CastMemberType.create(Types.ACTOR).getOk();
  }
}

export { CastMemberType, Types };
