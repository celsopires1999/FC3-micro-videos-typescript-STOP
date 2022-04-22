import Category from "../../domain/entities/category";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./dto/category-output";
import UseCase from "../../../@seedwork/application/use-case";
import CategoryExistsError from "#category/domain/errors/category-exists.error";

export default class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    if (await this.categoryRepo.exists(input.name)) {
      throw new CategoryExistsError(
        `${input.name} exists already in the categories collection`
      );
    }
    const entity = new Category(input);
    await this.categoryRepo.insert(entity);

    return CategoryOutputMapper.toOutput(entity);
  }
}

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategoryOutput;
