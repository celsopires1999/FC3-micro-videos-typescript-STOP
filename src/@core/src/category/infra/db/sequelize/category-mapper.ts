import { Category } from "#category/domain";
import {
  UniqueEntityId,
  EntityValidationError,
  LoadEntityError,
} from "#seedwork/domain";
import { CategoryModel } from "./category-model";

export class CategoryModelMapper {
  static toEntity(model: CategoryModel): Category {
    const { id, ...otherData } = model.toJSON();

    try {
      return new Category(otherData, new UniqueEntityId(id));
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.error);
      }

      throw e;
    }
  }
}

export default CategoryModelMapper;
