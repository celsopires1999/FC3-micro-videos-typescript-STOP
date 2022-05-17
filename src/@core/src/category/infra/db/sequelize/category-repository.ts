import { Category, CategoryRepository } from "#category/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { CategoryModel } from "./category-model";

export class CategorySequelizeRepository
  implements CategoryRepository.Repository
{
  sortableFields: string[];

  constructor(private categoryModel: typeof CategoryModel) {}

  async exists(name: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async search(
    props: CategoryRepository.SearchParams
  ): Promise<CategoryRepository.SearchResult> {
    throw new Error("Method not implemented.");
  }
  async insert(entity: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string | UniqueEntityId): Promise<Category> {
    throw new Error("Method not implemented.");
  }
  async findAll(): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }
  async update(entity: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string | UniqueEntityId): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default CategorySequelizeRepository;
