import { CastMemberProperties } from "../entities/cast-member";
import CastMemberType from "../entities/cast-member-type.vo";
import CastMemberValidatorFactory, {
  CastMemberRules,
  CastMemberValidator,
} from "./cast-member.validator";

class Stub {
  item: string;
  price: number;
  constructor(item: string, price: number) {
    this.item = item;
    this.price = price;
  }
}

describe("CastMemberValidator Tests", () => {
  let validator: CastMemberValidator;
  beforeEach(() => (validator = CastMemberValidatorFactory.create()));

  test("invalidation cases for name field", () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: ["name should not be empty"],
    });

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({
      validator,
      data: { name: "t".repeat(256) },
    }).containsErrorMessages({
      name: ["name must be shorter than or equal to 255 characters"],
    });
  });

  describe("invalidation cases for type field", () => {
    const arrange = [
      {
        data: {
          type: null as any,
        },
        message: {
          type: [
            "type must be an instance of CastMemberType",
            "type should not be empty",
            "type must be a non-empty object",
          ],
        },
      },
      {
        data: {
          type: {},
        },
        message: {
          type: [
            "type must be an instance of CastMemberType",
            "type must be a non-empty object",
          ],
        },
      },
      {
        data: {
          type: new Stub("item", 10),
        },
        message: {
          type: ["type must be an instance of CastMemberType"],
        },
      },
      {
        data: { type: 5 as any },
        message: {
          type: [
            "type must be an instance of CastMemberType",
            "type must be a non-empty object",
          ],
        },
      },
    ];

    test.each(arrange)("invalidate %# %o - team field", (i) => {
      expect({ validator, data: i.data }).containsErrorMessages(i.message);
    });
  });

  test("invalidation cases for created_at field", () => {
    expect({
      validator,
      data: { created_at: 5 as any },
    }).containsErrorMessages({
      created_at: ["created_at must be a Date instance"],
    });
  });

  describe("valid cases for fields", () => {
    const arrange: CastMemberProperties[] = [
      { name: "some name", type: CastMemberType.createDirector() },
      {
        name: "some name",
        type: CastMemberType.createActor(),
        created_at: new Date(),
      },
    ];
    test.each(arrange)("validate %# %o", (item) => {
      expect(validator.validate(item)).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CastMemberRules(item));
      expect(validator.errors).toBeNull;
    });
  });
});
