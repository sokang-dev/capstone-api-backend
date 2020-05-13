import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {JWTServiceBindings} from '../keys';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JwtService implements TokenService {
  constructor(
    @inject(JWTServiceBindings.JWT_SECRET) private jwtSecret: string,
    @inject(JWTServiceBindings.JWT_LIFESPAN) private jwtLifespan: string,
  ) {}

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token: userProfile is null',
      );
    }

    const userInfoForToken = {
      id: userProfile[securityId],
      name: userProfile.name,
      role: userProfile.role,
    };

    let token: string;
    try {
      token = await signAsync(userInfoForToken, this.jwtSecret, {
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
          role: decodedToken.role,
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
