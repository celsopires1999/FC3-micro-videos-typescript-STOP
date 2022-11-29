import { CreateCastMemberUseCase } from '@fc/micro-videos/cast-member/application';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCastMemberDto implements CreateCastMemberUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  type: number;
}
