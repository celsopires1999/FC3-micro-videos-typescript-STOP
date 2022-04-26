import { Category } from "#category/domain";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./dto/category-output";
import UseCase from "../../../@seedwork/application/use-case";
import CategoryExistsError from "#category/domain/errors/category-exists.error";

export default class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    await this.exists(input.name);

    const entity = new Category(input);
    await this.categoryRepo.insert(entity);

    return CategoryOutputMapper.toOutput(entity);
  }
  private async exists(name: string): Promise<void> {
    if (await this.categoryRepo.exists(name)) {
      throw new CategoryExistsError(
        `${name} exists already in the categories collection`
      );
    }
  }
}

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategoryOutput;
