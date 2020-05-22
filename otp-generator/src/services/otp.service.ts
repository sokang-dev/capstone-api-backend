import speakeasy from 'speakeasy';
import {Application, Applicationuser} from '../models';

export class OtpService {
  constructor() {}

  //function that generates OTP using speakeasy library
  generateOTP(appUser: Applicationuser, application: Application): string {
    const onetimepassword = speakeasy.totp({
      secret: appUser.userSecret,
      encoding: 'base32',
      digits: application.otpLength,
      step: application.otpLifetime,
    });
    return onetimepassword;
  }

  //function that sends OTP to developer
  async sendOTP(userOTP: string, appUser: Applicationuser): Promise<void> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = require('twilio')(accountSid, authToken);

    await client.messages.create({
      body: 'One Time Password: ' + userOTP,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: appUser.mobileNumber,
    });
  }

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
