import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEmail,
  IsEnum
} from 'class-validator';
import UserRolesEnum from '../enums/roles.Enum';

class UpdateUserDTO {
  @IsNotEmpty()
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;

  @IsNotEmpty()
  @IsBoolean()
  isActivated: boolean;
}

export default UpdateUserDTO;
