import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEmail,
  IsEnum
} from 'class-validator';
import UserRolesEnum from '../enums/roles.Enum';

class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @IsBoolean()
  isActivated: boolean;
}

export default CreateUserDTO;
