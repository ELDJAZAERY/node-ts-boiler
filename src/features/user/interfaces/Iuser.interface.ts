import UserRolesEnum from '../enums/roles.Enum';

export default interface IUser {
  identificator: String;

  designation: String;

  isActivated: boolean;

  isRequestVisible: boolean;

  isKeysVisible: boolean;

  isKeysEditable: boolean;

  isHistoricVisible: boolean;

  role: UserRolesEnum;

  isOwner: boolean;
}
