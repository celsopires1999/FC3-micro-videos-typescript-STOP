import ValueObject from "#seedwork/domain/value-objects/value-object";
import { InvalidCastMemberTypeError } from "../errors/cast-member-type.error";

export type CastMemberTypeProps = {
  code: number;
  description: string;
};

export class CastMemberType extends ValueObject<CastMemberTypeProps> {
  constructor(public readonly props: CastMemberTypeProps) {
    super(props);
    this.validate(props);
  }

  private validate(value: CastMemberTypeProps) {
    if (![1, 2].includes(value.code)) {
      throw new InvalidCastMemberTypeError("code must be either 1 or 2");
    }
    if (value.code === 1 && value.description !== "Director") {
      throw new InvalidCastMemberTypeError(
        "description must be Director when code is 1"
      );
    }
    if (value.code === 2 && value.description !== "Actor") {
      throw new InvalidCastMemberTypeError(
        "description must be Actor when code is 2"
      );
    }
  }

  get code() {
    return this.value.code;
  }

  get description() {
    return this.value.description;
  }

  static createDirector() {
    return new CastMemberType({ code: 1, description: "Director" });
  }

  static createActor() {
    return new CastMemberType({ code: 2, description: "Actor" });
  }

  static createByCode(code: number) {
    if (code === 1) {
      return CastMemberType.createDirector();
    }
    if (code === 2) {
      return CastMemberType.createActor();
    }

    throw new InvalidCastMemberTypeError(
      "code must be either 1 for Director or 2 for Actor"
    );
  }
}

export default CastMemberType;
