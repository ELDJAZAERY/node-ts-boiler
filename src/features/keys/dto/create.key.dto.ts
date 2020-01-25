import { IsString, IsNotEmpty } from 'class-validator';

export default class CreateKeyDTO {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  tradeRegister: string;
}
