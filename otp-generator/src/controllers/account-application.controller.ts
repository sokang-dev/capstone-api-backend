import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {Account, Application} from '../models';
import {AccountRepository} from '../repositories';
import {compareAccountId} from '../services/authorizer.service';

@authenticate('jwt')
@authorize({allowedRoles: ['admin', 'user'], voters: [compareAccountId]})
export class AccountApplicationController {
  constructor(
    @repository(AccountRepository)
    protected accountRepository: AccountRepository,
  ) {}

  @get('/accounts/{id}/applications')
  async findApplicationsByAccountId(
    @param.path.number('id') accountId: typeof Account.prototype.id,
  ): Promise<Application[]> {
    return this.accountRepository
      .applications(accountId)
      .find({include: [{relation: 'applicationusers'}]});
  }
}
