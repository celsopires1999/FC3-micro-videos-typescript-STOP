export class CategoryExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryExistsError";
  }
}

export default CategoryExistsError;
