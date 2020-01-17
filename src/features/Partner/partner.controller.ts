import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import validationMiddleware from '../../middlewares/dataValidator';

import { Partner, CreatePartnerDTO, PartnerService } from '.';

class KeysController implements Controller {
  path = '/key';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get(
      '/',
      validationMiddleware(CreatePartnerDTO),
      this.createPrtner
    );
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
