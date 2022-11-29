export class InvalidCastMemberTypeError extends Error {
  constructor(message?: string) {
    super(message || `Invalid params to CastMemberType`);
    this.name = "InvalidCastMemberTypeError";
  }
}
