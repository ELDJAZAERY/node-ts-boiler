import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEnum,
  IsAlphanumeric
} from 'class-validator';
import { OwnerRoleEnum, ClientRoleEnum } from '../enums/roles.Enum';

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
  @IsAlphanumeric()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class CreateOwnerDTO extends CreateUserDTO {
  @IsNotEmpty()
  @IsEnum(OwnerRoleEnum)
  role: OwnerRoleEnum;
}

export class CreateClientDTO extends CreateUserDTO {
  @IsNotEmpty()
  @IsEnum(ClientRoleEnum)
  role: ClientRoleEnum;

  @IsString()
  @IsNotEmpty()
  tradeRegister: string;
}
