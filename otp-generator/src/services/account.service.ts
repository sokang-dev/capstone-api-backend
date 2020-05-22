import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import * as bcrypt from 'bcrypt';
import {Account, Credentials} from '../models/account.model';
import {AccountRepository} from '../repositories';

export class AccountService implements UserService<Account, Credentials> {
  constructor(
    @repository(AccountRepository) private accountRepo: AccountRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<Account> {
    const credentialsError = 'Incorrect login credentials';

    const account = await this.accountRepo.findOne({
      where: {username: credentials.username},
    });

    if (!account) {
      throw new HttpErrors.Unauthorized(credentialsError);
    }

    if (!(await bcrypt.compare(credentials.password, account.password))) {
      throw new HttpErrors.Unauthorized(credentialsError);
    }

    return account;
  }

  convertToUserProfile(account: Account): UserProfile {
    return {
      [securityId]: account.id.toString(),
      id: account.id,
      name: account.username,
      role: account.role,
    };
  }
}
