import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';
import { HttpStatusEnum } from '../shared';
import JWTGenerator from '../utils/jwtGenerator';
import { User } from '../features/user';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const tokenHeader =
    req.headers['x-access-token'] || req.headers['authorization'];
  const usernameFromHeaders = req.headers['username'];
  const token: string = (tokenHeader as string)
    ? (tokenHeader as string).split(' ')[0] === 'Bearer'
      ? (tokenHeader as string).split(' ')[1]
      : `is't a Bearer Token`
    : 'invalide Token';
  const { username: usernameFromToken } = JWTGenerator.verify(token);
  const user: User | undefined = await User.findOne({
    username: usernameFromToken
  });
  if (user && usernameFromToken === usernameFromHeaders) {
    const { username, role, isActivated } = user;
    (req as any).user = { username, role, isActivated };
    return next();
  }

  return next(
    new HttpException(HttpStatusEnum.UNAUTHORIZED, 'Unauthorized User')
  );
};
