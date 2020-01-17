import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import OwnerService from './owner.service';
import { CreateOwnerDTO } from './dtos/create.user.dto';
import UpdateUserDTO from './dtos/update.user.dto';
import validationMiddleware from '../../middlewares/dataValidator';
import { Owner } from '.';
import UpdateUserPwdDTO from './dtos/update.user.password.dto';
import actionValidator from '../../middlewares/roles/action.validator';
import ActionRoleEnum from '../../middlewares/roles/action.enum';

class OwnerController implements Controller {
  path = '/owner';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get(
      '/',
      actionValidator(ActionRoleEnum.BASIC_OWNER),
      this.getAllOwner
    );
    this.route.get(
      '/profile/:identificator/',
      // actionValidator(ActionRoleStratagies.SELFISH),
      this.getOwner
    );
    this.route.post(
      '/',
      validationMiddleware(CreateOwnerDTO),
      actionValidator(ActionRoleEnum.SUPER_OWNER),
      this.createOwner
    );
    this.route.put(
      '/profile/:identificator',
      validationMiddleware(UpdateUserDTO),
      actionValidator(ActionRoleEnum.SELFISH),
      this.updateOwner
    );
    this.route.put(
      '/profile/:identificator/pwd/change',
      validationMiddleware(UpdateUserPwdDTO),
      actionValidator(ActionRoleEnum.SELFISH),
      this.updatePwd
    );
  }

  async getAllOwner(req: Request, res: Response): Promise<void> {
    const { identificator } = (req as any).iUser;
    const users = await OwnerService.getAllOwners(identificator);
    res.status(HttpStatusEnum.SUCCESS).send(users);
  }

  async getOwner(req: Request, res: Response): Promise<void> {
    const { identificator } = req.params;
    const owner: Owner = await OwnerService.getOwner(identificator);
    res.status(HttpStatusEnum.SUCCESS).send(owner.normalize());
  }

  async createOwner(req: Request, res: Response): Promise<void> {
    const createOwnerDTO: CreateOwnerDTO = req.body;
    const createdOwner: Owner = await OwnerService.createOwner(createOwnerDTO);
    res.status(HttpStatusEnum.CREATED).send(createdOwner.normalize());
  }

  async updateOwner(req: Request, res: Response): Promise<void> {
    const updateUserDTO: UpdateUserDTO = req.body;
    const { identificator } = req.params;
    const user: Owner = await OwnerService.updateOwner(
      identificator,
      updateUserDTO
    );
    res.status(HttpStatusEnum.SUCCESS).send(user.normalize());
  }

  async updatePwd(req: Request, res: Response): Promise<void> {}
}

export default OwnerController;
