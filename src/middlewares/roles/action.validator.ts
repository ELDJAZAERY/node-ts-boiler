import * as express from 'express';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import UserRolesEnum from '../../features/user/enums/roles.Enum';
import { User } from '../../features/user';
import ActionRoleStratagies from './action.enum';

function roleValidationMiddleware<T>(
  action: ActionRoleStratagies
): express.RequestHandler {
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
  action: ActionRoleStratagies
): Promise<boolean> => {
  const user = req.user;
  if (!user.isActivated) {
    return Promise.reject(
      new HttpException(
        HttpStatusEnum.FORBIDDEN,
        'Permission denied, Your account has been deactivated, please contact your admin'
      )
    );
  }

  const userConcernedByAction: string = extractUserConcernedByAction_username(
    req
  );

  switch (action) {
    case ActionRoleStratagies.SUPER:
      return SuperActionValidator(user);

    case ActionRoleStratagies.ADMIN: {
      const permited = await AdminActionValidator(user, userConcernedByAction);
      return permited;
    }
    case ActionRoleStratagies.SELFISH:
      return SelfishActionValidator(user, userConcernedByAction);

    case ActionRoleStratagies.BASIC:
      return true;

    default:
      return false;
  }
};

const extractUserConcernedByAction_username = (req: any): string => {
  const { username: usernameFromParams } = req.params;
  const { username: usernameFromBody } = req.body;

  return (usernameFromBody || usernameFromParams) as string;
};

const SuperActionValidator = (user: any): boolean => {
  return user && user.isActivated && user.role === UserRolesEnum.SUPER;
};

const AdminActionValidator = async (
  user: any,
  userConcernedByAction: string
): Promise<boolean> => {
  const userConcerned: User | undefined = await User.findOne({
    username: userConcernedByAction
  });
  return (
    user &&
    user.isActivated &&
    user.role === UserRolesEnum.ADMIN &&
    !!userConcerned &&
    userConcerned.role != UserRolesEnum.SUPER
  );
};

const SelfishActionValidator = (
  user: any,
  userConcernedByAction: string
): boolean => {
  return user && user.isActivated && user.username === userConcernedByAction;
};

export default roleValidationMiddleware;
