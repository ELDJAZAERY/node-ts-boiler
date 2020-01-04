import * as jwt from 'jsonwebtoken';
import config from 'config';

export default class JWTGenerator {
  private static readonly defaultSecretKey = 'U2FsdGVkX1Zx0aUWww2qoi2DmCohg9O';
  private static readonly defaultExpiresIn = '1m';

  static readonly signe = (data: any): string => {
    const {
      jwtSecret = JWTGenerator.defaultSecretKey,
      jwtExpires: expiresIn = JWTGenerator.defaultExpiresIn
    } = config.get('jwtConfigs');

    return jwt.sign(data, jwtSecret, { expiresIn });
  };

  static readonly verify = (token: string): any => {
    const { jwtSecret = JWTGenerator.defaultSecretKey } = config.get(
      'jwtConfigs'
    );
    try {
      return jwt.verify(token, jwtSecret);
    } catch {
      return 'invalid token';
    }
  };

  static readonly refreshToken = (username: String): string => {
    const { jwtSecret = JWTGenerator.defaultSecretKey } = config.get(
      'jwtConfigs'
    );
    return jwt.sign(username, jwtSecret);
  };
}
