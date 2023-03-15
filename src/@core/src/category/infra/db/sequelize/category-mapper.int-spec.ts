import { Category, CategoryId } from "#category/domain";
import { CategorySequelize } from "#category/infra";
import { LoadEntityError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CategoryModel, CategoryModelMapper } = CategorySequelize;

describe("CategoryMapper Integration Test", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should throw error when category is invalid", () => {
    const model = CategoryModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail("The category has not thrown a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should throw a generic error", () => {
    const model = CategoryModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
    });

    const error = new Error("Generic Error");

    const spyValidate = jest
      .spyOn(Category, "validate")
      .mockImplementation(() => {
        throw error;
      });

    expect(() => CategoryModelMapper.toEntity(model)).toThrowError(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a category model into a category entity", () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      id: "312cffad-1938-489e-a706-643dc9a3cfd3",
      name: "some category name",
      description: "some category description",
      is_active: false,
      created_at,
    });

    const category = CategoryModelMapper.toEntity(model);

    expect(category.toJSON()).toStrictEqual(
      new Category(
        {
          name: "some category name",
          description: "some category description",
          is_active: false,
          created_at,
        },
        new CategoryId("312cffad-1938-489e-a706-643dc9a3cfd3")
      ).toJSON()
    );
  });
});
