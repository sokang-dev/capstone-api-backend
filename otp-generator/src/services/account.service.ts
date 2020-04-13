import {UserService} from '@loopback/authentication';
import * as bcrypt from 'bcrypt';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';

import {Account, Credentials} from '../models/account.model';
import {repository} from '@loopback/repository';
import {AccountRepository} from '../repositories';

export class AccountService implements UserService<Account, Credentials> {
  constructor(
    @repository(AccountRepository) private accountRepo: AccountRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<Account> {
    const account = await this.accountRepo.findOne({
      where: {username: credentials.username},
    });

    if (!account) {
      throw new HttpErrors.NotFound(
        `Account ${'credentials.username'} does not exist`,
      );
    }

    if (!(await bcrypt.compare(credentials.password, account.password))) {
      throw new HttpErrors.Unauthorized('Incorrect login credentials');
    }

    return account;
  }

  convertToUserProfile(account: Account): UserProfile {
    return {
      [securityId]: account.id.toString(),
      id: account.id,
      name: account.username,
    };
  }
}
