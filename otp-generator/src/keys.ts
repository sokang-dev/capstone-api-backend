import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {Account, Credentials} from './models';
import {OtpService} from './services';

export namespace JWTServiceConstants {
  export const JWT_SECRET_VALUE = process.env.JWT_SECRET || 'otpgen217';
  export const JWT_LIFESPAN_VALUE = process.env.JWT_LIFESPAN || '600';
}

export namespace JWTServiceBindings {
  export const JWT_SECRET = BindingKey.create<string>('jwt.secret');

  export const JWT_LIFESPAN = BindingKey.create<string>('jwt.lifespan');

  export const JWT_SERVICE = BindingKey.create<TokenService>('jwt.service');
}

export namespace AccountServiceBindings {
  export const ACCOUNT_SERVICE = BindingKey.create<
    UserService<Account, Credentials>
  >('account.service');
}

export namespace OTPServiceBindings {
  export const OTP_SERVICE = BindingKey.create<OtpService>('otp.service');
}
