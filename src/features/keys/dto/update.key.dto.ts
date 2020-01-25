import { IsString, IsNotEmpty } from 'class-validator';

export default class UpdateKeyDTO {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  newKey: string;
}
