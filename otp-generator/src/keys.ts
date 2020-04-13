import {BindingKey} from '@loopback/core';

export namespace TokenServiceConstants {
  export const JWT_TOKEN_SECRET_VALUE =
    process.env.JWT_TOKEN_SECRET ?? 'otpgen217';

  export const JWT_TOKEN_LIFESPAN_VALUE =
    process.env.JWT_TOKEN_LIFESPAN ?? '600';
}

export namespace TokenServiceBindings {
  export const JWT_TOKEN_SECRET = BindingKey.create<string>('jwt.token.secret');

  export const JWT_TOKEN_LIFESPAN = BindingKey.create<string>(
    'jwt.token.lifespan',
  );
}
