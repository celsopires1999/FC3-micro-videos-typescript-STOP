import ValueObject from "../value-object";

class StubValueObject extends ValueObject {}
describe("ValueObject Unit Tests", () => {
  it("should set value", () => {
    let vo = new StubValueObject("string value");
    expect(vo.value).toBe("string value");

    vo = new StubValueObject({ prop1: "value1" });
    expect(vo.value).toStrictEqual({ prop1: "value1" });
  });

  describe("should converte to string", () => {
    const date = new Date();
    const arrange = [
      { received: "", expected: "" },
      { received: "fake test", expected: "fake test" },
      { received: 0, expected: "0" },
      { received: 1, expected: "1" },
      { received: 5, expected: "5" },
      { received: true, expected: "true" },
      { received: false, expected: "false" },
      { received: 0, expected: "0" },
      { received: date, expected: date.toString() },
      {
        received: { prop1: "value1" },
        expected: JSON.stringify({ prop1: "value1" }),
      },
    ];

    test.each(arrange)(
      "from $received to $expected",
      ({ received, expected }) => {
        const vo = new StubValueObject(received);
        expect(vo + "").toBe(expected);
      }
    );
  });

  it("should be an immutable value object", () => {
    const vo = new StubValueObject({
      prop1: "value1",
      deep: { prop2: "value2", prop3: new Date() },
    });

    expect(() => {
      vo.value.prop1 = "not to work";
    }).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );

    expect(() => {
      vo.value.deep = "not to work";
    }).toThrow(
      "Cannot assign to read only property 'deep' of object '#<Object>'"
    );

    expect(() => {
      vo.value.deep.prop2 = "not to work";
    }).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );

    expect(() => {
      vo.value.deep.prop3 = "not to work";
    }).toThrow(
      "Cannot assign to read only property 'prop3' of object '#<Object>'"
    );

    expect(vo.value.deep.prop3).toBeInstanceOf(Date);
  });
});
