import { IsNotEmpty, IsString, IsAlphanumeric } from 'class-validator';

export default class UpdateUserPwdDTO {
  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  newPassword: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  confirmPassword: string;
}
