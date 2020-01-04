import UserRolesEnum from '../enums/roles.Enum';

export default class AuthUser {
  username: string;

  email: string;

  role: UserRolesEnum;

  isActivated: boolean;
}
