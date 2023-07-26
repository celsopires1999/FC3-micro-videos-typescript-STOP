export class InvalidArgumentError extends Error {
  constructor(message?: string) {
    super(message || "Provided argument is invalid");
    this.name = "InvalidArgumentError";
  }
}

export default InvalidArgumentError;
