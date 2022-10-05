import { CreateCategoryUseCase } from '@fc/micro-videos/category/application';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto implements CreateCategoryUseCase.Input {
  @IsNotEmpty()
  name: string;
  description?: string;
  is_active?: boolean;
}
