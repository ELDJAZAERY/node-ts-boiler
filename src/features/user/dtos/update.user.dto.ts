import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEmail,
  IsEnum
} from 'class-validator';
import UserRolesEnum from '../enums/roles.Enum';

class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsNotEmpty()
  @IsBoolean()
  isActivated: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isHistoricVisible: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isKeysEditable: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isKeysVisible: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isRequestVisible: boolean;
}

export default UpdateUserDTO;
