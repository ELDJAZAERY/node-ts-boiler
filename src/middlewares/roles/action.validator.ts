import * as express from 'express';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import UserRolesEnum, {
  OwnerRoleEnum
} from '../../features/user/enums/roles.Enum';
import { IUser, Owner, Client, User } from '../../features/user';
import ActionRoleEnum from './action.enum';
import UserManager from '../../features/user/models/user.manager';

function actionValidator<T>(action: ActionRoleEnum): express.RequestHandler {
  return async (req: any, res: any, next: any): Promise<void> => {
    if (await checkRole(req, res, action)) {
      next();
    } else {
      next(
        new HttpException(
          HttpStatusEnum.FORBIDDEN,
          'Permission denied, please contact your admin'
        )
      );
    }
  };
}

const checkRole = async (
  req: any,
  res: any,
  action: ActionRoleEnum
): Promise<boolean> => {
  const iUser: IUser = req.iUser;

  await checkIsActivated(iUser);

  const userConcernedByAction: string = extractUserConcernedByAction(req);

  switch (action) {
    case ActionRoleEnum.SUPER_OWNER:
      return iUser && iUser.role === UserRolesEnum.SUPER;

    case ActionRoleEnum.ADMIN_OWNER: {
      const permited = await AdminActionValidator(iUser, userConcernedByAction);
      return permited;
    }

    case ActionRoleEnum.SELFISH:
      return SelfishActionValidator(iUser, userConcernedByAction);

    case ActionRoleEnum.BASIC_OWNER:
      return iUser && iUser.isOwner;

    case ActionRoleEnum.SUPER_CLIENT:
      return (
        iUser &&
        iUser.isKeysVisible &&
        iUser.isKeysEditable &&
        iUser.isKeysEditable &&
        iUser.isRequestVisible &&
        iUser.isHistoricVisible
      );

    case ActionRoleEnum.SUPER_CLIENT_OWNER:
      return SuperOwnerOrSuperClient(req);

    case ActionRoleEnum.CLIENT_OR_BASIC_OWNER:
      return ClientOrBasicOwner(req);

    case ActionRoleEnum.SELFISH_OR_BASIC_OWNER:
      return SelfishOrBasicOwner(req, userConcernedByAction);

    case ActionRoleEnum.SELFISH_OR_SUPER_OWNER:
      return await SelfishOrSuperOwner(req, userConcernedByAction);

    case ActionRoleEnum.ONLY_CLIENT_HAVE_SAME_PARTNER:
      return OnlyClientWithSamePartner(req);

    case ActionRoleEnum.FETCH_KEYS:
      return iUser && iUser.isKeysVisible;

    case ActionRoleEnum.EDIT_KEYS:
      return iUser && iUser.isKeysEditable;

    case ActionRoleEnum.FETCH_REQUESTS:
      return iUser && iUser.isRequestVisible;

    case ActionRoleEnum.FETCH_HISTORIC:
      return iUser && iUser.isHistoricVisible;

    default:
      return false;
  }
};

const checkIsActivated = (iUser: IUser): Promise<boolean> => {
  return iUser && iUser.isActivated
    ? Promise.resolve(true)
    : Promise.reject(
        new HttpException(
          HttpStatusEnum.FORBIDDEN,
          'Permission denied, Your account has been deactivated, please contact your admin'
        )
      );
};

const extractUserConcernedByAction = (req: any): string => {
  const { identificator: identificatorFromParams } = req.params;
  const { identificator: identificatorFromBody } = req.body;

  return (identificatorFromBody || identificatorFromParams) as string;
};

const AdminActionValidator = async (
  iUser: IUser,
  userConcernedByAction: string
): Promise<boolean> => {
  const userConcerned: Owner | Client = await UserManager.findOne(
    userConcernedByAction
  );
  return (
    iUser &&
    iUser.role === UserRolesEnum.ADMIN &&
    !!userConcerned &&
    userConcerned.role !== OwnerRoleEnum.SUPER &&
    userConcerned.role !== OwnerRoleEnum.ADMIN
  );
};

const SuperOwnerOrSuperClient = (req: any): boolean => {
  const iUser: IUser = req.iUser;
  return (
    iUser.role === UserRolesEnum.SUPER ||
    (iUser.role === UserRolesEnum.CLIENT_ADMIN &&
      OnlyClientWithSamePartner(req))
  );
};

const ClientOrBasicOwner = (req: any): boolean => {
  const iUser: IUser = req.iUser;
  return (iUser && iUser.isOwner) || OnlyClientWithSamePartner(req);
};

const OnlyClientWithSamePartner = (req: any): boolean => {
  const iUser: IUser = req.iUser;
  const tradeRegister = req.params.tradeRegister || req.body.tradeRegister;
  try {
    return (
      !!iUser &&
      !!iUser.partner &&
      iUser.partner.tradeRegister === tradeRegister
    );
  } catch {
    return false;
  }
};

const SelfishOrBasicOwner = (
  req: any,
  userConcernedByAction: string
): boolean => {
  const iUser: IUser = req.iUser;
  return (
    (iUser && iUser.isOwner) ||
    SelfishActionValidator(iUser, userConcernedByAction)
  );
};

/**
 * @_Super Owner canot checnge pwd of another @_Super Owner
 */
const SelfishOrSuperOwner = async (
  req: any,
  userConcernedByAction: string
): Promise<boolean> => {
  const iUser: IUser = req.iUser;
  const userConerned: IUser = await UserManager.getIUser(userConcernedByAction);
  return (
    (iUser &&
      iUser.isOwner &&
      iUser.role === UserRolesEnum.SUPER &&
      userConerned.role !== UserRolesEnum.SUPER) ||
    SelfishActionValidator(iUser, userConcernedByAction)
  );
};

const SelfishActionValidator = (
  iUser: IUser,
  userConcernedByAction: string
): boolean => {
  return iUser && iUser.identificator === userConcernedByAction;
};

export default actionValidator;
