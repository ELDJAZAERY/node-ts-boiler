import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import { Client } from '../user';
import { Group } from '.';

class KeysController implements Controller {
  path = '/key';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/', this.createGroup);
  }

  async createGroup(req: Request, res: Response): Promise<void> {
    const client = await Client.findOneOrFail();
    const group = new Group();
    group.presave();
    group.client = client;
    group.save();

    res.sendStatus(201);
  }
}

export default KeysController;
