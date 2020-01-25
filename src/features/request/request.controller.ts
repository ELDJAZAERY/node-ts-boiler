import { Controller, HttpStatusEnum } from '../../shared';
import { Router, Request, Response } from 'express';
import { RequestType, Level } from '.';
import CreateTypeDTO from './dto/create.type.dto';
import RequestService from './request.service';
import CreateLevelDTO from './dto/create.level.dto';
import UpdateTypeDTO from './dto/update.type.dto';
import UpdateLevelDTO from './dto/update.level.dto';
import validationMiddleware from '../../middlewares/dataValidator';
import actionValidator from '../../middlewares/roles/action.validator';
import ActionRoleEnum from '../../middlewares/roles/action.enum';

export default class RequestController implements Controller {
  path = '/request';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.route.post(
      '/level',
      actionValidator(ActionRoleEnum.SUPER_OWNER),
      validationMiddleware(CreateLevelDTO),
      this.createLevel
    );
    this.route.put(
      '/level',
      actionValidator(ActionRoleEnum.SUPER_OWNER),
      validationMiddleware(UpdateLevelDTO),
      this.updateLevel
    );
    this.route.get(
      '/level',
      actionValidator(ActionRoleEnum.BASIC_OWNER),
      this.fetchLevels
    );

    this.route.post(
      '/type',
      validationMiddleware(CreateTypeDTO),
      actionValidator(ActionRoleEnum.SUPER_OWNER),
      this.createType
    );
    this.route.put(
      '/type',
      actionValidator(ActionRoleEnum.SUPER_OWNER),
      validationMiddleware(UpdateTypeDTO),
      this.updateType
    );
    this.route.get(
      '/type',
      actionValidator(ActionRoleEnum.BASIC_OWNER),
      this.fetchTypes
    );
  };

  createType = async (req: Request, res: Response): Promise<void> => {
    const createTypeDTO: CreateTypeDTO = req.body;
    const requestType: RequestType = await RequestService.createType(
      createTypeDTO
    );
    res.status(HttpStatusEnum.CREATED).send(requestType);
  };

  updateType = async (req: Request, res: Response): Promise<void> => {
    const updateTypeDTO: UpdateTypeDTO = req.body;
    const updated: RequestType = await RequestService.updateType(updateTypeDTO);
    res.status(HttpStatusEnum.SUCCESS).send(updated);
  };

  fetchTypes = async (req: Request, res: Response): Promise<void> => {
    const types: RequestType[] = await RequestService.fetchTypes();
    res.status(HttpStatusEnum.SUCCESS).send(types);
  };

  createLevel = async (req: Request, res: Response): Promise<void> => {
    const createLevelDTO: CreateLevelDTO = req.body;
    const level: Level = await RequestService.createLevel(createLevelDTO);
    res.status(HttpStatusEnum.CREATED).send(level);
  };

  updateLevel = async (req: Request, res: Response): Promise<void> => {
    const updateLevelDTO: UpdateLevelDTO = req.body;
    const updated: Level = await RequestService.updateLevel(updateLevelDTO);
    res.status(HttpStatusEnum.SUCCESS).send(updated);
  };

  fetchLevels = async (req: Request, res: Response): Promise<void> => {
    const levels: Level[] = await RequestService.fetchLevels();
    res.status(HttpStatusEnum.SUCCESS).send(levels);
  };
}
