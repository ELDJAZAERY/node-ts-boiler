import UserRolesEnum from '../enums/roles.Enum';
import { Partner } from '../../Partner';

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

  partner?: Partner;
}
