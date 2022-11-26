export class CastMemberExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CastMemberExistsError";
  }
}

export default CastMemberExistsError;
