import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {UserProfile, securityId} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';

import {TokenServiceBindings} from '../keys';
import {decode} from 'punycode';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JwtService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.JWT_SECRET) private jwtSecret: string,
    @inject(TokenServiceBindings.JWT_LIFESPAN) private jwtLifespan: string,
  ) {}

  async generateToken(UserProfile: UserProfile): Promise<string> {
    if (!UserProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token: userProfile is null',
      );
    }

    let token: string;
    try {
      token = await signAsync(UserProfile, this.jwtSecret, {
        expiresIn: Number(this.jwtLifespan),
      });
    } catch (err) {
      throw new HttpErrors.Unauthorized(`Error encoding token: ${err}`);
    }

    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized('Error verifying token: Token is null');
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(token, this.jwtSecret);

      userProfile = Object.assign(
        {[securityId]: '', name: ''},
        {
          [securityId]: decodedToken.id,
          name: decodedToken.name,
          id: decodedToken.id,
        },
      );
    } catch (err) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: ${err.message}`,
      );
    }

    return userProfile;
  }
}
