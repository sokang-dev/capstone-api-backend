import {
  DefaultCrudRepository,
  BelongsToAccessor,
  repository,
  juggler,
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
    @inject('datasources.OtpgenDb') dataSource: juggler.DataSource,
    @repository.getter(AccountRepository)
    accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(Application, dataSource);

    this.account = this.createBelongsToAccessorFor(
      'account',
      accountRepositoryGetter,
    );
  }

  // Update modifiedDate property when model is about to be updated
  definePersistedModel(entityClass: typeof Application) {
    const application = super.definePersistedModel(entityClass);

    application.observe('before save', async ctx => {
      // When it is a full update
      if (ctx.instance) {
        ctx.instance.modifiedDate = new Date();
      }

      // When it is a partial update
      else {
        ctx.data.modifiedDate = new Date();
      }
    });

    return application;
  }
}
