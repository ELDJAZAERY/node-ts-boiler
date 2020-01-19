import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEmail,
  IsEnum
} from 'class-validator';
import { OwnerRoleEnum, ClientRoleEnum } from '../enums/roles.Enum';

export class UpdateUserDTO {
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

export class UpdateOwnerDTO extends UpdateUserDTO {
  @IsNotEmpty()
  @IsEnum(OwnerRoleEnum)
  role: OwnerRoleEnum;
}

export class UpdateClientDTO extends UpdateUserDTO {
  @IsNotEmpty()
  @IsEnum(ClientRoleEnum)
  role: ClientRoleEnum;
}
