import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';
import { HttpStatusEnum } from '../shared';
import JWTGenerator from '../utils/jwtGenerator';
import { User, IUser } from '../features/user';
import UserManager from '../features/user/models/user.manager';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const tokenHeader: string = (req.headers['x-access-token'] ||
    req.headers['authorization']) as string;

  const idFromHeaders = req.headers['identificator'];

  const token: string =
    tokenHeader &&
    tokenHeader.split(' ')[0] === 'Bearer' &&
    tokenHeader.split(' ')[1]
      ? tokenHeader.split(' ')[1]
      : 'invalide Token';

  const { identificator: idFromToken } = JWTGenerator.verify(token);
  const iUser: IUser | undefined = await UserManager.getIUser(idFromToken);
  if (iUser && idFromToken === idFromHeaders) {
    (req as any).iUser = iUser;
    return next();
  }

  return next(
    new HttpException(HttpStatusEnum.UNAUTHORIZED, 'Unauthorized User')
  );
};
