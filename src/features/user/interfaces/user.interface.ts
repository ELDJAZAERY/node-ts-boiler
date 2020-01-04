import UserRolesEnum from '../enums/roles.Enum';

export default interface IUser extends Document {
  username: string;

  email: string;

  role: UserRolesEnum;

  isActivated: boolean;
}
