import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  juggler,
} from '@loopback/repository';
import {
  Applicationuser,
  ApplicationuserRelations,
  Application,
} from '../models';
import {OtpgenDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ApplicationRepository} from './application.repository';

export class ApplicationuserRepository extends DefaultCrudRepository<
  Applicationuser,
  typeof Applicationuser.prototype.id,
  ApplicationuserRelations
> {
  public readonly application: BelongsToAccessor<
    Application,
    typeof Applicationuser.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: juggler.DataSource,
    @repository.getter(ApplicationRepository)
    applicationRepositoryGetter: Getter<ApplicationRepository>,
  ) {
    super(Applicationuser, dataSource);

    this.application = this.createBelongsToAccessorFor(
      'application',
      applicationRepositoryGetter,
    );
  }

  // Update modifiedDate property when model is about to be updated
  definePersistedModel(entityClass: typeof Applicationuser) {
    const applicationuser = super.definePersistedModel(entityClass);

    applicationuser.observe('before save', async ctx => {
      // When it is a full update
      if (ctx.instance) {
        ctx.instance.modifiedDate = new Date();
      }

      // When it is a partial update
      else {
        ctx.data.modifiedDate = new Date();
      }
    });

    return applicationuser;
  }
}
