// O either será um array personalizado do JavaScript
// O 1º elemento é o valor
// o 2º elemento é o erro

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

type IteratorValue<Ok, Error> = Ok | Error;

export class Either<Ok, Error = any>
  implements Iterable<IteratorValue<Ok, Error>>
{
  private _ok: Ok;
  private _error: Error;

  private constructor(ok: Ok, error: Error) {
    this._ok = ok;
    this._error = error;
  }

  get ok() {
    return this._ok;
  }

  get error() {
    return this._error;
  }

  isOk() {
    return this.ok !== null;
  }

  isFail() {
    return this.error !== null;
  }

  static of<Ok = any>(value: Ok): Either<Ok> {
    return Either.ok(value);
  }

  static ok<T>(value: T): Either<T, null> {
    return new Either(value, null);
  }

  static fail<T>(error: T): Either<null, T> {
    return new Either(null, error);
  }

  static safe<Ok, Error = any>(fn: () => Ok): Either<Ok, Error> {
    try {
      return Either.ok(fn());
    } catch (e) {
      return Either.fail(e);
    }
  }

  map<NewOk>(fn: (value: Ok) => NewOk): Either<NewOk, Error> {
    if (this.isOk()) {
      return Either.ok(fn(this.ok));
    }
    return Either.fail(this.error);
  }

  chain<NewOk, NewError = any>(
    fn: (value: Ok) => Either<NewOk, NewError>
  ): Either<NewOk, Error | NewError> {
    if (this.isOk()) {
      return fn(this.ok);
    }
    return Either.fail(this.error);
  }

  chainEach<NewOk, NewError = any>(
    fn: (value: Flatten<Ok>) => Either<Flatten<NewOk>, Flatten<NewError>>
  ): Either<NewOk, Error | NewError> {
    if (this.isOk()) {
      if (!Array.isArray(this.ok)) {
        throw new Error("Method chainEach only works with arrays");
      }
      const result = this.ok.map((o) => {
        return fn(o);
      });
      const errors = result.filter((r) => r.isFail());
      if (errors.length > 0) {
        return Either.fail(errors.map((e) => e.error)) as any;
      }
      return Either.ok(result.map((r) => r.ok)) as any;
    }
    return Either.fail<Error>(this.error);
  }

  asArray(): [Ok, Error] {
    return [this.ok, this.error];
  }

  [Symbol.iterator](): Iterator<IteratorValue<Ok, Error>, any, undefined> {
    return new EitherIterator<Ok, Error>({
      ok: this.ok,
      error: this.error,
    });
  }
}

class EitherIterator<Ok, Error>
  implements
    Iterator<IteratorValue<Ok, Error>, IteratorValue<Ok, Error>, undefined>
{
  private _value: { ok: Ok; error: Error };
  private index = 0;

  constructor(value: { ok: Ok; error: Error }) {
    this._value = value;
  }

  next(): IteratorResult<
    IteratorValue<Ok, Error>,
    IteratorValue<Ok, Error> | undefined
  > {
    if (this.index === 0) {
      this.index++;
      return {
        value: this._value.ok,
        done: false,
      };
    }

    if (this.index === 1) {
      this.index++;
      return {
        value: this._value.error,
        done: false,
      };
    }

    return {
      value: null,
      done: true,
    };
  }
}
