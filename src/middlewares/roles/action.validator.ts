import * as express from 'express';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import UserRolesEnum from '../../features/user/enums/roles.Enum';
import { IUser, Owner, Client } from '../../features/user';
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
      return true;

    case ActionRoleEnum.SUPER_CLIENT:
      return (
        iUser &&
        iUser.isKeysVisible &&
        iUser.isKeysEditable &&
        iUser.isKeysEditable &&
        iUser.isRequestVisible &&
        iUser.isHistoricVisible
      );

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
    userConcerned.role !== UserRolesEnum.SUPER &&
    userConcerned.role !== UserRolesEnum.ADMIN
  );
};

const SelfishActionValidator = (
  iUser: IUser,
  userConcernedByAction: string
): boolean => {
  return iUser && iUser.identificator === userConcernedByAction;
};

export default actionValidator;
