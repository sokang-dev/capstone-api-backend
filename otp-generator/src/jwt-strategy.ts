import {
  AuthenticationStrategy,
  TokenService,
  asAuthStrategy,
} from '@loopback/authentication';
import {inject, bind} from '@loopback/context';
import {UserProfile} from '@loopback/security';
import {
  HttpErrors,
  Request,
  asSpecEnhancer,
  OpenApiSpec,
  mergeSecuritySchemeToSpec,
  mergeOpenAPISpec,
} from '@loopback/rest';

import {JWTServiceBindings} from './keys';

export const SECURITY_SPEC = [{jwt: []}];

@bind(asAuthStrategy, asSpecEnhancer)
export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(JWTServiceBindings.JWT_SERVICE)
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
        `Authorization header does not have the pattern: 'Bearer xx.yy.zz'`,
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

  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    const securitySpec = {
      security: SECURITY_SPEC,
    };
    const mergedSpec = mergeOpenAPISpec(spec, securitySpec);

    return mergeSecuritySchemeToSpec(mergedSpec, this.name, {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    });
  }
}
