import { IsString, IsNotEmpty } from 'class-validator';

export default class UpdateTypeDTO {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  newType: string;
}
