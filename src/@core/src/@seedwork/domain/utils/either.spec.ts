import { Either } from "./either";

describe("Either Unit Tests", () => {
  test("of", () => {
    const either = Either.of<number>(1);
    expect(either.isOk()).toBeTruthy();
    expect(either.isFail()).toBeFalsy();
    expect(either.ok).toBe(1);
    expect(either.error).toBeNull();

    const [ok, error] = either.asArray();
    expect(ok).toBe(1);
    expect(error).toBeNull();
  });

  test("ok", () => {
    const either = Either.ok<number>(1);
    expect(either.isOk()).toBeTruthy();
    expect(either.isFail()).toBeFalsy();
    expect(either.ok).toBe(1);
    expect(either.error).toBeNull();

    const [ok, error] = either.asArray();
    expect(ok).toBe(1);
    expect(error).toBeNull();
  });

  test("fail", () => {
    const oops = new Error("Oops!");
    const either = Either.fail(oops);
    expect(either.isOk()).toBeFalsy();
    expect(either.isFail()).toBeTruthy();
    expect(either.ok).toBeNull();
    expect(either.error).toEqual(oops);

    const [ok, error] = either.asArray();
    expect(ok).toBeNull();
    expect(error).toEqual(oops);
  });

  test("safe", () => {
    const either1 = Either.safe(() => 1);
    expect(either1.isOk()).toBeTruthy();
    expect(either1.isFail()).toBeFalsy();
    expect(either1.ok).toBe(1);
    expect(either1.error).toBeNull();

    const oops = new Error("Oops!");
    const either2 = Either.safe(() => {
      throw oops;
    });
    expect(either2.isOk()).toBeFalsy();
    expect(either2.isFail()).toBeTruthy();
    expect(either2.ok).toBeNull();
    expect(either2.error).toEqual(oops);

    const [ok, error] = either2.asArray();
    expect(ok).toBeNull();
    expect(error).toEqual(oops);
  });

  test("map method", () => {
    const either1 = Either.ok(1);
    const newEither = either1
      .map((value) => value + 1)
      .map((value) => value + 1);
    expect(newEither.isOk()).toBeTruthy();
    expect(newEither.isFail()).toBeFalsy();
    expect(newEither.ok).toBe(3);
    expect(newEither.error).toBeNull();

    const either2 = Either.fail(1);
    //@ts-expect-error: this is a test
    const newEither2 = either2.map((value) => value + 1);
    expect(newEither2.isOk()).toBeFalsy();
    expect(newEither2.isFail()).toBeTruthy();
    expect(newEither2.ok).toBeNull();
    expect(newEither2.error).toBe(1);
  });

  test("chain method", () => {
    const either1 = Either.ok(1);
    const newEither = either1
      .chain((value) => Either.ok(value + 1))
      .chain((value) => Either.ok(value + 1));
    expect(newEither.isOk()).toBeTruthy();
    expect(newEither.isFail()).toBeFalsy();
    expect(newEither.ok).toBe(3);
    expect(newEither.error).toBeNull();

    const either2 = Either.fail(1);
    //@ts-expect-error: this is a test
    const newEither2 = either2.chain((value) => Either.ok(value + 1));
    expect(newEither2.isOk()).toBeFalsy();
    expect(newEither2.isFail()).toBeTruthy();
    expect(newEither2.ok).toBeNull();
    expect(newEither2.error).toBe(1);
  });

  test("chainEach method", () => {
    const either1 = Either.ok(1);
    //@ts-expect-error: this is a test
    expect(() => either1.chainEach((value) => value)).toThrowError(
      "Method chainEach only works with arrays"
    );

    const either2 = Either.ok([1, 2, 3]);
    const newEither2 = either2
      .chainEach((value) => Either.ok(value + 1))
      .chainEach((value) => Either.ok(value + 1));
    expect(newEither2.isOk()).toBeTruthy();
    expect(newEither2.isFail()).toBeFalsy();
    expect(newEither2.ok).toEqual([3, 4, 5]);
    expect(newEither2.error).toBeNull();

    const either3 = Either.fail(1);
    //@ts-expect-error: this is a test
    const newEither3 = either3.chainEach((value) => Either.ok(value + 1));
    expect(newEither3.isOk()).toBeFalsy();
    expect(newEither3.isFail()).toBeTruthy();
    expect(newEither3.ok).toBeNull();
    expect(newEither3.error).toBe(1);
  });
});
