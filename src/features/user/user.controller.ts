import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import UserService from './user.service';
import { User } from '.';
import CreateUserDTO from './dtos/create.user.dto';
import UpdateUserDTO from './dtos/update.user.dto';
import validationMiddleware from '../../middlewares/dataValidator';
import actionValidator from '../../middlewares/roles/action.validator';
import ActionRoleStratagies from '../../middlewares/roles/action.enum';

class UserController implements Controller {
  path = '/users';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get(
      '/',
      actionValidator(ActionRoleStratagies.BASIC),
      this.getAllUsers
    );
    this.route.get(
      '/profile/:username/',
      actionValidator(ActionRoleStratagies.SELFISH),
      this.getUser
    );
    this.route.post(
      '/',
      validationMiddleware(CreateUserDTO),
      actionValidator(ActionRoleStratagies.SUPER),
      this.createUser
    );
    this.route.put(
      '/profile/:username',
      validationMiddleware(UpdateUserDTO),
      actionValidator(ActionRoleStratagies.SUPER),
      this.updateUser
    );
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const { username } = (req as any).user;
    const users: User[] | undefined = await UserService.getAllUsers(username);
    res.status(HttpStatusEnum.SUCCESS).send(users);
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const user: User | undefined = await UserService.getUser(username);
    if (user) {
      res.status(HttpStatusEnum.SUCCESS).send(user.normalize());
    } else res.status(HttpStatusEnum.BAD_REQUEST).send('User not found');
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const createUserDTO: CreateUserDTO = req.body;
    const createdUser: User = await UserService.createUser(createUserDTO);
    res.status(HttpStatusEnum.CREATED).send(createdUser.normalize());
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const updateUserDTO: UpdateUserDTO = req.body;
    const { username } = req.params;
    const user: User = await UserService.updateUser(username, updateUserDTO);
    res.status(HttpStatusEnum.SUCCESS).send(user.normalize());
  }
}

export default UserController;
