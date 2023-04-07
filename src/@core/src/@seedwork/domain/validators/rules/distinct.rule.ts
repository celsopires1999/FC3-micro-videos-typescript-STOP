import { checkIsIterable } from "#seedwork/domain/utils/array";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function Distinct(
  fnEquality?: (a: any, b: any) => boolean,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "Distinct",
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          if (!value) return true;

          const isIterable = checkIsIterable(value);
          if (!isIterable) return true;

          if (!fnEquality) {
            const set = new Set();
            for (const item of value) {
              if (set.has(item)) {
                return false;
              }
              set.add(item);
            }
          } else {
            const set = new Set();
            const copy = "values" in value ? value.values() : value;
            for (const item of copy) {
              const found = Array.from(set).find((x) => fnEquality(x, item));
              if (found) {
                return false;
              }
              set.add(item);
            }
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} should not have repeated values`;
        },
      },
    });
  };
}
