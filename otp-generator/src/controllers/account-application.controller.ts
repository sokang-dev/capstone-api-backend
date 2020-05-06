import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {Account, Application} from '../models';
import {AccountRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
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
