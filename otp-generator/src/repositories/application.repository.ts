import {
  DefaultCrudRepository,
  BelongsToAccessor,
  repository,
} from '@loopback/repository';
import {inject, Getter} from '@loopback/core';

import {Application, ApplicationRelations, Account} from '../models';
import {OtpgenDbDataSource} from '../datasources';
import {AccountRepository} from './account.repository';

export class ApplicationRepository extends DefaultCrudRepository<
  Application,
  typeof Application.prototype.id,
  ApplicationRelations
> {
  public readonly account: BelongsToAccessor<
    Account,
    typeof Application.prototype.id
  >;

  constructor(
    @inject('datasources.OtpgenDb') dataSource: OtpgenDbDataSource,
    @repository.getter(AccountRepository)
    accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(Application, dataSource);

    this.account = this.createBelongsToAccessorFor(
      'account',
      accountRepositoryGetter,
    );
  }
}
