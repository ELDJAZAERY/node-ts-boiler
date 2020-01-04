import LoginDTO, {
  userIdWithEmail,
  userIdWithUsername
} from './dtos/login.dto';
import { User } from '../user';
import JWTGenerator from '../../utils/jwtGenerator';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import loginResponse from './interfaces/login.response';
import RefreshTokenDTO from './dtos/refreshToken.dto';

export default class AuthService {
  static async login(loginDTO: LoginDTO): Promise<loginResponse> {
    const userId: userIdWithEmail | userIdWithUsername = loginDTO.userId;
    const password: string = loginDTO.password;
    const user: User | undefined = await User.findOne({ ...userId });

    if (user && user.checkPWD(password) && user.username && user.isActivated) {
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
        'The username or The password is incorrect, please contact your admin'
      )
    );
  }

  static async refreshToken(
    refreshTokenDTO: RefreshTokenDTO
  ): Promise<loginResponse> {
    const { username, token, refreshToken } = refreshTokenDTO;

    const user: User | undefined = await User.findOne({ username });
    const userToken: any = JWTGenerator.verify(token);

    if (user && userToken.username !== username) {
      const isValide = user.checkRefreshToken(refreshToken);
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

  private static async generateTokens(user: User): Promise<loginResponse> {
    const { username, email, role, isActivated } = user;
    const token = JWTGenerator.signe({ username, email, role, isActivated });
    const refreshToken = JWTGenerator.refreshToken(username);
    await user.saveRefreshToken(refreshToken);
    return { token, refreshToken };
  }
}
