import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import validationMiddleware from '../../middlewares/dataValidator';

import { Partner, CreatePartnerDTO, PartnerService } from '.';
import actionValidator from '../../middlewares/roles/action.validator';
import ActionRoleEnum from '../../middlewares/roles/action.enum';

class KeysController implements Controller {
  path = '/partner';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get(
      '/',
      actionValidator(ActionRoleEnum.BASIC_OWNER),
      this.fetchAllPartner
    );
    this.route.get(
      '/profile/:tradeRegister',
      actionValidator(ActionRoleEnum.CLIENT_OR_BASIC_OWNER),
      this.fetchPartner
    );
    this.route.put(
      '/profile/:tradeRegister/update',
      validationMiddleware(CreatePartnerDTO),
      actionValidator(ActionRoleEnum.SUPER_OWNER),
      this.updatePartner
    );
    this.route.post(
      '/',
      validationMiddleware(CreatePartnerDTO),
      actionValidator(ActionRoleEnum.SUPER_OWNER),
      this.createPrtner
    );
  }

  async fetchAllPartner(req: Request, res: Response): Promise<void> {
    const partners: Partner[] = await PartnerService.fetchAll();
    res.status(HttpStatusEnum.SUCCESS).send(partners);
  }

  async fetchPartner(req: Request, res: Response): Promise<void> {
    const { tradeRegister } = req.params;
    const partner: Partner | undefined = await PartnerService.getPartner(
      tradeRegister
    );
    res.status(HttpStatusEnum.SUCCESS).send(partner);
  }

  async updatePartner(req: Request, res: Response): Promise<void> {
    const updatePartnerDTO: CreatePartnerDTO = req.body;
    console.log('entred');
    const { tradeRegister } = req.params;
    const partner: Partner = await PartnerService.updateOne(
      tradeRegister,
      updatePartnerDTO
    );
    res.status(HttpStatusEnum.SUCCESS).send(partner);
  }

  async createPrtner(req: Request, res: Response): Promise<void> {
    const createPartnerDTO: CreatePartnerDTO = req.body;
    const partner: Partner = await PartnerService.createPartner(
      createPartnerDTO
    );
    res.status(HttpStatusEnum.CREATED).send(partner.normalize());
  }
}

export default KeysController;
