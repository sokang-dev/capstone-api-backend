import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {Account, AccountRelations, Application} from '../models';
import {OtpgenDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ApplicationRepository} from './application.repository';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.id,
  AccountRelations
> {
  public readonly applications: HasManyRepositoryFactory<
    Application,
    typeof Account.prototype.id
  >;

  constructor(
    @inject('datasources.OtpgenDb') dataSource: OtpgenDbDataSource,
    @repository.getter('ApplicationRepository')
    applicationRepositoryGetter: Getter<ApplicationRepository>,
  ) {
    super(Account, dataSource);
    this.applications = this.createHasManyRepositoryFactoryFor(
      'applications',
      applicationRepositoryGetter,
    );
  }

  // Update modifiedDate property when model is about to be updated
  definePersistedModel(entityClass: typeof Account) {
    const account = super.definePersistedModel(entityClass);

    account.observe('before save', async ctx => {
      // When it is a full update
      if (ctx.instance) {
        ctx.instance.modifiedDate = new Date();
      }

      // When it is a partial update
      else {
        ctx.data.modifiedDate = new Date();
      }
    });

    return account;
  }
}
