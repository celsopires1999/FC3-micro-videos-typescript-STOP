import { Either } from "./either";

describe("Either Unit Tests", () => {
  it("should be an Array instance", () => {
    const either = new Either(1, 2);
    expect(either).toBeInstanceOf(Array);
  });

  test("constructor", () => {
    const either = new Either(1, 2);
    expect(either[0]).toBe(1);
    expect(either[1]).toBe(2);
  });

  test("ok", () => {
    const either = Either.ok(1);
    expect(either[0]).toBe(1);
    expect(either[1]).toBeNull();
  });

  test("fail", () => {
    const error = new Error("Oops!");
    const either = Either.fail(error);
    expect(either[0]).toBeNull();
    expect(either[1]).toEqual(error);
  });

  test("getOK", () => {
    const either = Either.ok("Success");
    expect(either.getOk()).toBe("Success");
  });

  test("getFail", () => {
    const error = new Error("Oops!");
    const either = Either.fail(error);
    expect(either.getFail()).toEqual(error);
  });

  test("isOK", () => {
    const either = Either.ok("Success");
    expect(either.isOk()).toBeTruthy();
    expect(either.isFail()).toBeFalsy();
  });

  test("getFail", () => {
    const error = new Error("Oops!");
    const either = Either.fail(error);
    expect(either.isFail()).toBeTruthy();
    expect(either.isOk()).toBeFalsy();
  });
});
