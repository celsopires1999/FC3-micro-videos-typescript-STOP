import { CategoryOutputMapper } from "./category-output";
import Category from "../../../domain/entities/category";

describe("CategoryOutputMapper Unit Tests", () => {
  it("should convert category into output", () => {
    const created_at = new Date();
    const entity = new Category({
      name: "movie",
      description: "some description",
      is_active: true,
      created_at,
    });
    const spyToJSON = jest.spyOn(entity, "toJSON");
    const output = CategoryOutputMapper.toOutput(entity);

    expect(spyToJSON).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  });
});
