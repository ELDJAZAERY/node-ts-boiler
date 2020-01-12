import { IsNotEmpty, IsAlphanumeric, IsString } from 'class-validator';

export default class LoginDTO {
  @IsNotEmpty()
  @IsString()
  identificator: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;
}
