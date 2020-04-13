import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import {HttpErrors, Request} from '@loopback/rest';

import {TokenServiceBindings} from './keys';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private tokenService: TokenService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const userProfile: UserProfile = await this.tokenService.verifyToken(token);

    return userProfile;
  }

  // Grab token from auth header request
  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header not found');
    }

    const authHeaderValue = request.headers.authorization;

    // Auth header must start with 'Bearer' as part of Bearer Authentication scheme
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `'Authorization header is not of type 'Bearer'`,
      );
    }

    // Split auth header into 2 parts: 'Bearer' and 'xx.yy.zz'
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header does not have the pattern: 'Bearer xx.yy.zz'`,
      );
    }
    const token = parts[1];

    return token;
  }
}
