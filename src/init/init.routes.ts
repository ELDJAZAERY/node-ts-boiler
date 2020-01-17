import { Express } from 'express';
import { Controller } from '../shared';
import { OwnerController, ClientController } from '../features/user';
import { AuthController } from '../features/auth';
import { PartnerController } from '../features/Partner';
import authMiddleware from '../middlewares/auth';

const URL_PREFIX = '/api/v1';

export default (app: Express): void => {
  const controllers: Controller[] = [
    new AuthController(),
    new OwnerController(),
    new ClientController(),
    new PartnerController()
  ];

  controllers.forEach(controller => {
    if (controller.path === '/auth')
      app.use(URL_PREFIX + controller.path, controller.route);
    else
      app.use(URL_PREFIX + controller.path, authMiddleware, controller.route);
  });
};
