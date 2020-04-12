import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Applicationuser} from '../models';
import {ApplicationuserRepository} from '../repositories';

export class ApplicationuserController {
  constructor(
    @repository(ApplicationuserRepository)
    public applicationuserRepository: ApplicationuserRepository,
  ) {}

  //Create application user
  @post('/applicationusers', {
    responses: {
      '200': {
        description: 'Applicationuser model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Applicationuser)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Applicationuser, {
            title: 'NewApplicationuser',
          }),
        },
      },
    })
    applicationuser: Applicationuser,
  ): Promise<Applicationuser> {
    return this.applicationuserRepository.create(applicationuser);
  }

  //Get all application users
  @get('/applicationusers', {
    responses: {
      '200': {
        description: 'Array of Applicationuser model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Applicationuser, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Applicationuser) filter?: Filter<Applicationuser>,
  ): Promise<Applicationuser[]> {
    return this.applicationuserRepository.find(filter);
  }

  //Get application user by id
  @get('/applicationusers/{id}', {
    responses: {
      '200': {
        description: 'Applicationuser model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Applicationuser, {
              includeRelations: true,
            }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Applicationuser, {exclude: 'where'})
    filter?: FilterExcludingWhere<Applicationuser>,
  ): Promise<Applicationuser> {
    return this.applicationuserRepository.findById(id, filter);
  }

  //Partial update application user by id
  @patch('/applicationusers/{id}', {
    responses: {
      '204': {
        description: 'Applicationuser PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Applicationuser, {partial: true}),
        },
      },
    })
    applicationuser: Applicationuser,
  ): Promise<void> {
    await this.applicationuserRepository.updateById(id, applicationuser);
  }

  //Full update application user by id
  @put('/applicationusers/{id}', {
    responses: {
      '204': {
        description: 'Applicationuser PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() applicationuser: Applicationuser,
  ): Promise<void> {
    await this.applicationuserRepository.replaceById(id, applicationuser);
  }

  //Delete application user by id
  @del('/applicationusers/{id}', {
    responses: {
      '204': {
        description: 'Applicationuser DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.applicationuserRepository.deleteById(id);
  }
}
