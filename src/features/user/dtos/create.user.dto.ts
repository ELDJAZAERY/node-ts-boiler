import { IsString, IsNotEmpty, IsBoolean, IsEnum } from 'class-validator';
import UserRolesEnum from '../enums/roles.Enum';

export class CreateUserDTO {
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

export class CreateOwnerDTO extends CreateUserDTO {}

export class CreateClientDTO extends CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  tradeRegister: string;
}
