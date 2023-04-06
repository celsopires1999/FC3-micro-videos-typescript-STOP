import { checkIsIterable } from "#seedwork/domain/utils/array";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function IterableNotEmpty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IterableNotEmpty",
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return (
            value && checkIsIterable(value) && Array.from(value).length > 0
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} should not be empty`;
        },
      },
    });
  };
}
