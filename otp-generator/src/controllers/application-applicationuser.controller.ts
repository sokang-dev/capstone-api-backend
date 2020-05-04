import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {Application, Applicationuser} from '../models';
import {ApplicationRepository} from '../repositories';
import {compareAccountId} from '../services/authorizer.service';

@authenticate('jwt')
@authorize({allowedRoles: ['admin', 'user'], voters: [compareAccountId]})
export class ApplicationApplicationUserController {
  constructor(
    @repository(ApplicationRepository)
    protected applicationRepository: ApplicationRepository,
  ) {}

  @get('/applications/{id}/applicationusers')
  async findApplicationUsersByApplicationId(
    @param.path.number('id') applicationId: typeof Application.prototype.id,
  ): Promise<Applicationuser[]> {
    return this.applicationRepository.applicationusers(applicationId).find();
  }
}
