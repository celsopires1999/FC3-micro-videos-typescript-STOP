import { FieldsErrors } from "#seedwork/domain";

export class LoadEntityError extends Error {
  constructor(public error: FieldsErrors, message?: string) {
    super(message ?? "An entity could not be loaded");
    this.name = "LoadEntityError";
  }
}
