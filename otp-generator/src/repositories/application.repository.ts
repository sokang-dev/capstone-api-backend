import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  Account,
  Application,
  ApplicationRelations,
  Applicationuser,
} from '../models';
import {AccountRepository} from './account.repository';
import {ApplicationuserRepository} from './applicationuser.repository';

export class ApplicationRepository extends DefaultCrudRepository<
  Application,
  typeof Application.prototype.id,
  ApplicationRelations
> {
  public readonly account: BelongsToAccessor<
    Account,
    typeof Application.prototype.id
  >;

  public readonly applicationusers: HasManyRepositoryFactory<
    Applicationuser,
    typeof Application.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: juggler.DataSource,
    @repository.getter(AccountRepository)
    accountRepositoryGetter: Getter<AccountRepository>,
    @repository.getter('ApplicationuserRepository')
    applicationuserGetter: Getter<ApplicationuserRepository>,
  ) {
    super(Application, dataSource);

    this.account = this.createBelongsToAccessorFor(
      'account',
      accountRepositoryGetter,
    );
    this.applicationusers = this.createHasManyRepositoryFactoryFor(
      'applicationusers',
      applicationuserGetter,
    );

    this.registerInclusionResolver(
      'applicationusers',
      this.applicationusers.inclusionResolver,
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
