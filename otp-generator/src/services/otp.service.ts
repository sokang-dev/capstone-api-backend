import speakeasy from 'speakeasy';

export class OtpService {
  constructor() {}

  async verifyOTP(
    userSecret: string,
    userOTP: string,
    otpLifetime: number,
    otpLength: number,
  ): Promise<boolean> {
    const verifyOTP = speakeasy.totp.verify({
      secret: userSecret,
      encoding: 'base32',
      token: userOTP,
      step: otpLifetime,
      digits: otpLength,
    });
    return verifyOTP;
  }
}
