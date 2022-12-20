const EitherConstructor: new <Ok, Error>(...p: [Ok, Error]) => [Ok, Error] =
  Array as any;
export class Either<Ok, Error = any> extends EitherConstructor<Ok, Error> {
  constructor(...p: [Ok, Error]) {
    super(...p);
  }

  static ok<T>(value: T): Either<T, null> {
    return new Either(value, null);
  }

  static fail<T>(error: T): Either<null, T> {
    return new Either(null, error);
  }

  getOk() {
    return this[0];
  }

  getFail() {
    return this[1];
  }

  isOk() {
    return this[1] === null;
  }

  isFail() {
    return this[1] !== null;
  }
}
