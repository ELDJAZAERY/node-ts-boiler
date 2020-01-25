import { IsString, IsNotEmpty } from 'class-validator';

export default class CreateTypeDTO {
  @IsString()
  @IsNotEmpty()
  type: string;
}
