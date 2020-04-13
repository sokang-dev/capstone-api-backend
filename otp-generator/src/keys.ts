import {BindingKey} from '@loopback/core';
import {TokenService} from '@loopback/authentication';

export namespace TokenServiceConstants {
  export const JWT_SECRET_VALUE = process.env.JWT_SECRET ?? 'otpgen217';

  export const JWT_LIFESPAN_VALUE = process.env.JWT_LIFESPAN ?? '600';
}

export namespace TokenServiceBindings {
  export const JWT_SECRET = BindingKey.create<string>('jwt.secret');

  export const JWT_LIFESPAN = BindingKey.create<string>('jwt.lifespan');

  export const TOKEN_SERVICE = BindingKey.create<TokenService>('jwt.service');
}
