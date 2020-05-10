import {Applicationuser} from '../models';
import speakeasy from 'speakeasy';

export class OtpService {
  constructor() {}

  async verifyUserToken(
    appUser: Applicationuser,
    userToken: string,
  ): Promise<boolean> {
    const verifyUserToken = speakeasy.totp.verify({
      secret: appUser.userSecret,
      encoding: 'base32',
      token: userToken,
    });
    return verifyUserToken;
  }
}
