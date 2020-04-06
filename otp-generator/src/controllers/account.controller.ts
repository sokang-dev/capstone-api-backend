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
  HttpErrors,
} from '@loopback/rest';
import * as bcrypt from 'bcrypt';

import {Account} from '../models';
import {AccountRepository} from '../repositories';

export class AccountController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
  ) {}

  // Use for hashing password
  saltRounds = 10;

  // Register account
  @post('/accounts/register', {
    responses: {
      '200': {
        description: 'Register successful',
        content: {'application/json': {schema: getModelSchemaRef(Account)}},
      },
    },
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccount',
          }),
        },
      },
    })
    account: Omit<Account, 'id'>,
  ): Promise<Account> {
    // Hash password
    account.password = bcrypt.hashSync(account.password, this.saltRounds);
    return this.accountRepository.create(account);
  }

  // Login account
  @post('/accounts/login', {
    responses: {
      '200': {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: {
              id: 'string',
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {username: 'string', password: 'string'},
        },
      },
    })
    account: Account,
  ): Promise<object> {
    const exists = await this.accountRepository.findOne({
      where: {username: account.username},
    });

    if (exists) {
      if (!bcrypt.compareSync(account.password, exists.password)) {
        throw new HttpErrors.Unauthorized('Incorrect login credentials');
      }
    } else {
      throw new HttpErrors.Unauthorized('Incorrect login credentials');
    }

    return {id: exists.id};
  }

  // Get all accounts
  @get('/accounts', {
    responses: {
      '200': {
        description: 'Array of Account model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Account, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Account) filter?: Filter<Account>,
  ): Promise<Account[]> {
    return this.accountRepository.find(filter);
  }

  // Get account by id
  @get('/accounts/{id}', {
    responses: {
      '200': {
        description: 'Account model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Account, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Account, {exclude: 'where'})
    filter?: FilterExcludingWhere<Account>,
  ): Promise<Account> {
    return this.accountRepository.findById(id, filter);
  }

  // Partial update account by id
  @patch('/accounts/{id}', {
    responses: {
      '204': {
        description: 'Account PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Account,
  ): Promise<void> {
    console.log(account);
    // If password is being updated
    if (account.password) {
      // Hash password
      account.password = bcrypt.hashSync(account.password, this.saltRounds);
    }

    await this.accountRepository.updateById(id, account);
  }

  // Full update account by id
  @put('/accounts/{id}', {
    responses: {
      '204': {
        description: 'Account PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() account: Account,
  ): Promise<void> {
    await this.accountRepository.replaceById(id, account);
  }

  @del('/accounts/{id}', {
    responses: {
      '204': {
        description: 'Account DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.accountRepository.deleteById(id);
  }
}
