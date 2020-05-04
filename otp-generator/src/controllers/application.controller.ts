import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Application} from '../models';
import {ApplicationRepository} from '../repositories';
import {compareAccountId} from '../services/authorizer.service';

@authenticate('jwt')
export class ApplicationController {
  constructor(
    @repository(ApplicationRepository)
    public applicationRepository: ApplicationRepository,
  ) {}

  // Create an application
  @post('/applications', {
    responses: {
      '200': {
        description: 'Application model instance',
        content: {'application/json': {schema: getModelSchemaRef(Application)}},
      },
    },
  })
  @authorize({allowedRoles: ['admin', 'user'], voters: [compareAccountId]})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {
            title: 'NewApplication',
            exclude: ['id'],
          }),
        },
      },
    })
    application: Omit<Application, 'id'>,
  ): Promise<Application> {
    return this.applicationRepository.create(application);
  }

  // Get all applications
  @get('/applications', {
    responses: {
      '200': {
        description: 'Array of Application model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Application, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authorize({allowedRoles: ['admin'], voters: [compareAccountId]})
  async find(
    @param.filter(Application) filter?: Filter<Application>,
  ): Promise<Application[]> {
    return this.applicationRepository.find(filter);
  }

  // Get an application by application id
  @get('/applications/{id}', {
    responses: {
      '200': {
        description: 'Application model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Application, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authorize({allowedRoles: ['admin', 'user'], voters: [compareAccountId]})
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Application, {exclude: 'where'})
    filter?: FilterExcludingWhere<Application>,
  ): Promise<Application> {
    return this.applicationRepository.findById(id, filter);
  }

  // Partial update application by application id
  @patch('/applications/{id}', {
    responses: {
      '204': {
        description: 'Application PATCH success',
      },
    },
  })
  @authorize({allowedRoles: ['admin', 'user'], voters: [compareAccountId]})
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {partial: true}),
        },
      },
    })
    application: Application,
  ): Promise<void> {
    await this.applicationRepository.updateById(id, application);
  }

  // Delete application by application id
  @del('/applications/{id}', {
    responses: {
      '204': {
        description: 'Application DELETE success',
      },
    },
  })
  @authorize({allowedRoles: ['admin', 'user'], voters: [compareAccountId]})
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.applicationRepository.deleteById(id);
  }
}
