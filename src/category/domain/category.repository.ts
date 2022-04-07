import { SerachableRepositoryInterface } from "../../@seedwork/domain/repository/repository-contracts";
import Category from "./entities/category";

export default interface CategoryRepository
  extends SerachableRepositoryInterface<Category, any, any> {}
