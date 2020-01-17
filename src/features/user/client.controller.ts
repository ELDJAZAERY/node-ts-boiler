import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import ClientService from './client.service';
import { CreateClientDTO } from './dtos/create.user.dto';
import UpdateUserDTO from './dtos/update.user.dto';
import validationMiddleware from '../../middlewares/dataValidator';
import { Client } from '.';
import UpdateUserPwdDTO from './dtos/update.user.password.dto';
// import actionValidator from '../../middlewares/roles/action.validator';
// import ActionRoleStratagies from '../../middlewares/roles/action.enum';

class ClientController implements Controller {
  path = '/client';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.post(
      '/',
      validationMiddleware(CreateClientDTO),
      // actionValidator(ActionRoleStratagies.SUPER),
      this.createClient
    );
    this.route.get(
      '/',
      // actionValidator(ActionRoleStratagies.BASIC),
      this.getAllClient
    );
    this.route.get(
      '/profile/:identificator/',
      // actionValidator(ActionRoleStratagies.SELFISH),
      this.getClient
    );
    this.route.put(
      '/profile/:identificator',
      validationMiddleware(UpdateUserDTO),
      // actionValidator(ActionRoleStratagies.SUPER),
      this.updateClient
    );
    this.route.put(
      '/profile/:identificator/pwd/change',
      validationMiddleware(UpdateUserPwdDTO),
      // actionValidator(ActionRoleStratagies.SUPER),
      this.updatePwd
    );
  }

  async getAllClient(req: Request, res: Response): Promise<void> {
    const { identificator } = (req as any).iUser;
    const clients = await ClientService.getAllClients(identificator);
    res.status(HttpStatusEnum.SUCCESS).send(clients);
  }

  async getClient(req: Request, res: Response): Promise<void> {
    const { identificator } = req.params;
    const client = await ClientService.getClient(identificator);
    res.status(HttpStatusEnum.SUCCESS).send(client.normalize());
  }

  async createClient(req: Request, res: Response): Promise<void> {
    const createClientDTO: CreateClientDTO = req.body;
    const createdClient: Client = await ClientService.createClient(
      createClientDTO
    );
    res.status(HttpStatusEnum.CREATED).send(createdClient.normalize());
  }

  async updateClient(req: Request, res: Response): Promise<void> {
    const updateUserDTO: UpdateUserDTO = req.body;
    const { identificator } = req.params;
    const user: Client = await ClientService.updateClient(
      identificator,
      updateUserDTO
    );
    res.status(HttpStatusEnum.SUCCESS).send(user.normalize());
  }

  async updatePwd(req: Request, res: Response): Promise<void> {}
}

export default ClientController;
