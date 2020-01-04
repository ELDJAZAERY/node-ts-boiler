import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import AuthService from './auth.service';
import validationMiddleware from '../../middlewares/dataValidator';
import LoginDTO from './dtos/login.dto';
import loginResponse from './interfaces/login.response';
import RefreshTokenDTO from './dtos/refreshToken.dto';

export default class AuthController implements Controller {
  path = '/auth';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/login', validationMiddleware(LoginDTO), this.login);
    this.route.get(
      '/refresh',
      validationMiddleware(RefreshTokenDTO),
      this.refreshToken
    );
  }

  async login(req: Request, res: Response): Promise<void> {
    const loginDTO: LoginDTO = req.body;
    const tokens: loginResponse = await AuthService.login(loginDTO);
    res.status(HttpStatusEnum.SUCCESS).send(tokens);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshTokenDTO: RefreshTokenDTO = req.body;
    const tokens: loginResponse = await AuthService.refreshToken(
      refreshTokenDTO
    );
    res.status(HttpStatusEnum.SUCCESS).send(tokens);
  }
}
