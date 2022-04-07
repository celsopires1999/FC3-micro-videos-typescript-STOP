import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/in-memory-repository";
import CategoryRepository from "../../domain/category.repository";
import Category from "../../domain/entities/category";

export default class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository {}
