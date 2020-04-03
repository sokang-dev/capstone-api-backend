import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
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
    @inject('datasources.OtpgenDb') dataSource: OtpgenDbDataSource,
    @repository.getter(ApplicationRepository)
    applicationRepositoryGetter: Getter<ApplicationRepository>,
  ) {
    super(Applicationuser, dataSource);

    this.application = this.createBelongsToAccessorFor(
      'application',
      applicationRepositoryGetter,
    );
  }
}
