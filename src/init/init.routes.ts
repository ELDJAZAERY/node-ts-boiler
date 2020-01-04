import { Express } from 'express';
import { Controller } from '../shared';
import { UserController } from '../features/user';
import { AuthController } from '../features/auth';
import authMiddleware from '../middlewares/auth';

const URL_PREFIX_V1 = '/dashboard/api/v1';
const URL_PREFIX = URL_PREFIX_V1;

export default (app: Express): void => {
  const controllers: Controller[] = [
    new UserController(),
    new AuthController()
  ];

  controllers.forEach(controller => {
    if (controller.path === '/auth')
      app.use(URL_PREFIX + controller.path, controller.route);
    else
      app.use(URL_PREFIX + controller.path, authMiddleware, controller.route);
  });
};
