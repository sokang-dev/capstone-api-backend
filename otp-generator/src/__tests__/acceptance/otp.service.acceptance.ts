import {expect} from '@loopback/testlab';
import {OtpService} from '../../services';

describe('OTPController', () => {
  const otpService = new OtpService();

  const appData = {
    id: 1,
    otpLifetime: 10,
    otpLength: 10,
  };

  const appUserData = {
    id: 1,
    email: 'samsmith@gmail.com',
    userSecret: 'usersecret',
  };

  it('Generate and verify OTP Successfully', async () => {
    //Act
    const otp = otpService.generateOTP(
      appUserData.userSecret,
      appData.otpLength,
      appData.otpLifetime,
    );

    const verify = await otpService.verifyOTP(
      appUserData.userSecret,
      otp,
      appData.otpLifetime,
      appData.otpLength,
    );

    //Assert
    expect(verify).to.equal(true);
  });

  it('Generate OTP and verify false for different OTP lengths', async () => {
    //Act
    const otp = otpService.generateOTP(
      appUserData.userSecret,
      5,
      appData.otpLifetime,
    );

    const verify = await otpService.verifyOTP(
      appUserData.userSecret,
      otp,
      appData.otpLifetime,
      appData.otpLength,
    );

    //Assert
    expect(verify).to.equal(false);
  });
});
