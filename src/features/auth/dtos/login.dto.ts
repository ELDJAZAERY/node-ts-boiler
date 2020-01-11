import {
  IsNotEmpty,
  IsAlphanumeric,
  IsNotEmptyObject,
  IsObject
} from 'class-validator';

export default class LoginDTO {
  @IsObject()
  @IsNotEmptyObject()
  identificator: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;
}
