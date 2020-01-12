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

  const userIdentConcernedByAction: string = extractUserConcernedByAction(req);

  switch (action) {
    case ActionRoleEnum.SUPER_OWNER:
      return SuperActionValidator(iUser);

    case ActionRoleEnum.ADMIN_OWNER: {
      const permited = await AdminActionValidator(
        iUser,
        userIdentConcernedByAction
      );
      return permited;
    }
    case ActionRoleEnum.SELFISH:
      return SelfishActionValidator(iUser, userIdentConcernedByAction);

    case ActionRoleEnum.BASIC_OWNER:
      return true;

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

const SuperActionValidator = (iUser: IUser): boolean => {
  return iUser && iUser.isActivated && iUser.role === UserRolesEnum.SUPER;
};

const AdminActionValidator = async (
  iUser: IUser,
  userIdentConcernedByAction: string
): Promise<boolean> => {
  const userConcerned: Owner | Client = await UserManager.findOne(
    userIdentConcernedByAction
  );
  return (
    iUser &&
    iUser.isActivated &&
    iUser.role === UserRolesEnum.ADMIN &&
    !!userConcerned &&
    userConcerned.role !== UserRolesEnum.SUPER &&
    userConcerned.role !== UserRolesEnum.ADMIN
  );
};

const SelfishActionValidator = (
  iUser: IUser,
  userIdentConcernedByAction: string
): boolean => {
  return (
    iUser &&
    iUser.isActivated &&
    iUser.identificator === userIdentConcernedByAction
  );
};

export default actionValidator;
