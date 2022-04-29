import ClassValidatorFields from "../../../@seedwork/domain/validators/class-validator-fields";
import { FieldsError } from "../../../@seedwork/domain/validators/validator-fields-interface";
import { objectContaining } from "expect";
import { EntityValidationError } from "../errors/validation-error";

type Received =
  | { validator: ClassValidatorFields<any>; data: any }
  | (() => any);

expect.extend({
  containsErrorMessages(received: Received, expected: FieldsError) {
    if (typeof received === "function") {
      try {
        received();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorsMessages(error.error, expected);
      }
    } else {
      const { validator, data } = received;
      const validated = validator.validate(data);
      if (validated) {
        return isValid();
      }
      return assertContainsErrorsMessages(validator.errors, expected);
    }
  },
});

function isValid() {
  return { pass: false, message: () => "The data is valid" };
}

function assertContainsErrorsMessages(
  expected: FieldsError,
  received: FieldsError
) {
  const isMatch = objectContaining(received).asymmetricMatch(expected);

  return isMatch
    ? { pass: true, message: () => "" }
    : {
        pass: false,
        message: () =>
          `The validation errors do not contain ${JSON.stringify(
            expected
          )}. Current: ${JSON.stringify(received)}`,
      };
}
