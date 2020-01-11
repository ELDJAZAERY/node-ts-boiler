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
  identificator: String;

  @IsNotEmpty()
  @IsString()
  designation: String;

  @IsNotEmpty()
  @IsBoolean()
  isActivated: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isRequestVisible: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isKeysVisible: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isKeysEditable: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isHistoricVisible: boolean;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;
}

export default CreateUserDTO;
