import {
  IsDate,
  IsInstance,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import ClassValidatorFields from "../../../@seedwork/domain/validators/class-validator-fields";
import { CastMemberProperties } from "../entities/cast-member";
import CastMemberType from "../entities/cast-member-type.vo";

export class CastMemberRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmptyObject()
  @IsNotEmpty()
  @IsInstance(CastMemberType)
  type: CastMemberType;

  @IsDate()
  @IsOptional()
  created_at: Date;

  constructor({ name, type, created_at }: CastMemberProperties) {
    Object.assign(this, { name, type, created_at });
  }
}

export class CastMemberValidator extends ClassValidatorFields<CastMemberRules> {
  validate(data: CastMemberProperties): boolean {
    return super.validate(new CastMemberRules(data ?? ({} as any)));
  }
}

export class CastMemberValidatorFactory {
  static create() {
    return new CastMemberValidator();
  }
}

export default CastMemberValidatorFactory;
