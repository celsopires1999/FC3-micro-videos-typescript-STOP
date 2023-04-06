import { CategoryId } from "#category/domain/entities/category";
import { IterableNotEmpty } from "#seedwork/domain/validators/rules/iterable-not-empty.rule";
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import ClassValidatorFields from "../../../@seedwork/domain/validators/class-validator-fields";
import { GenreProperties } from "../entities/genre";

export class GenreRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IterableNotEmpty()
  categories_id: Map<string, CategoryId>;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @IsDate()
  @IsOptional()
  created_at: Date;

  constructor({ name, is_active, created_at }: GenreProperties) {
    Object.assign(this, { name, is_active, created_at });
  }
}

export class GenreValidator extends ClassValidatorFields<GenreRules> {
  validate(data: GenreProperties): boolean {
    return super.validate(new GenreRules(data ?? ({} as any)));
  }
}

export class GenreValidatorFactory {
  static create() {
    return new GenreValidator();
  }
}

export default GenreValidatorFactory;
