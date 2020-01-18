import LoginDTO from './dtos/login.dto';

import JWTGenerator from '../../utils/jwtGenerator';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import loginResponse from './interfaces/login.response';
import RefreshTokenDTO from './dtos/refreshToken.dto';
import { IUser, Owner, Client } from '../user';
import UserManager from '../user/models/user.manager';

export default class AuthService {
  static async login(loginDTO: LoginDTO): Promise<loginResponse> {
    const { identificator, password } = loginDTO;

    const user: Client | Owner = await UserManager.findOne(identificator);

    if (user && user.isActivated && user.checkPWD(password)) {
      return AuthService.generateTokens(user);
    }

    if (user && !user.isActivated) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.FORBIDDEN,
          'Your account has been deactivated, please contact your admin'
        )
      );
    }

    return Promise.reject(
      new HttpException(
        HttpStatusEnum.UNAUTHORIZED,
        'The username or The password is incorrect'
      )
    );
  }

  static async refreshToken(
    refreshTokenDTO: RefreshTokenDTO
  ): Promise<loginResponse> {
    const { identificator, token, refreshToken } = refreshTokenDTO;

    const user: Client | Owner = await UserManager.findOne(identificator);
    const refresh_token_Data: any = JWTGenerator.verify(refreshToken);
    // token should be expired
    const tokenData: any = JWTGenerator.verify(token);

    if (
      user &&
      refresh_token_Data.identificator === identificator &&
      // token should be expired
      tokenData.identificator === undefined
    ) {
      const isValide = await user.checkRefreshToken(refreshToken);
      if (isValide) return AuthService.generateTokens(user);
    }

    /**
     * if user isn't exist or token is already valide
     */
    return Promise.reject(
      new HttpException(
        HttpStatusEnum.UNAUTHORIZED,
        'The refresh token is invalid, please login again'
      )
    );
  }

  private static async generateTokens(
    user: Owner | Client
  ): Promise<loginResponse> {
    /**
     * the Client obj is instance of Owner
     * so user instanceof Owner it is always true
     */
    const isOwner = !(user instanceof Client);
    const {
      identificator,
      role,
      isActivated,
      isRequestVisible,
      isKeysVisible,
      isKeysEditable,
      isHistoricVisible
    } = user;
    const token = JWTGenerator.signe({
      identificator,
      isOwner,
      role,
      isActivated,
      isRequestVisible,
      isKeysVisible,
      isKeysEditable,
      isHistoricVisible
    });

    const refreshToken = JWTGenerator.refreshToken({
      identificator,
      isOwner,
      role
    });

    await user.saveRefreshToken(refreshToken);
    return { token, refreshToken };
  }
}
