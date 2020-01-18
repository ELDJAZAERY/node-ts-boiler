import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import ClientService from './client.service';
import { CreateClientDTO } from './dtos/create.user.dto';
import UpdateUserDTO from './dtos/update.user.dto';
import validationMiddleware from '../../middlewares/dataValidator';
import { Client, IUser } from '.';
import UpdateUserPwdDTO from './dtos/update.user.password.dto';
import ActionRoleEnum from '../../middlewares/roles/action.enum';
import actionValidator from '../../middlewares/roles/action.validator';

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
      actionValidator(ActionRoleEnum.SUPER_CLIENT_OWNER),
      this.createClient
    );
    this.route.get(
      '/',
      actionValidator(ActionRoleEnum.BASIC_OWNER),
      this.getAllClient
    );
    this.route.get(
      '/:tradeRegister/accounts',
      actionValidator(ActionRoleEnum.CLIENT_OR_BASIC_OWNER),
      this.getPartnerClients
    );
    this.route.get(
      '/profile/:identificator/',
      actionValidator(ActionRoleEnum.SELFISH_OR_BASIC_OWNER),
      this.getClient
    );
    this.route.put(
      '/profile/:identificator',
      validationMiddleware(UpdateUserDTO),
      actionValidator(ActionRoleEnum.SUPER_CLIENT_OWNER),
      this.updateClient
    );
    this.route.put(
      '/profile/:identificator/pwd/change',
      validationMiddleware(UpdateUserPwdDTO),
      actionValidator(ActionRoleEnum.SELFISH),
      this.updatePwd
    );
  }

  async getAllClient(req: Request, res: Response): Promise<void> {
    const clients = await ClientService.getAllClients();
    res.status(HttpStatusEnum.SUCCESS).send(clients);
  }

  async getPartnerClients(req: Request, res: Response): Promise<void> {
    const { tradeRegister } = req.params;
    const clients = await ClientService.getPartnerClient(tradeRegister);
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
