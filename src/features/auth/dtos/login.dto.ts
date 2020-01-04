import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsAlphanumeric,
  IsNotEmptyObject,
  IsObject
} from 'class-validator';

export default class LoginDTO {
  @IsObject()
  @IsNotEmptyObject()
  userId: userIdWithEmail | userIdWithUsername;

  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;
}

export class userIdWithEmail {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class userIdWithUsername {
  @IsString()
  @IsNotEmpty()
  username: string;
}
