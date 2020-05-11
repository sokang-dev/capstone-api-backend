import {Applicationuser, Application} from '../models';
import speakeasy from 'speakeasy';

export class OtpService {
  constructor() {}

  async verifyOTP(
    appUser: Applicationuser,
    userOTP: string,
    application: Application,
  ): Promise<boolean> {
    const verifyOTP = speakeasy.totp.verify({
      secret: appUser.userSecret,
      encoding: 'base32',
      token: userOTP,
      step: application.otpLifetime,
    });
    return verifyOTP;
  }
}
