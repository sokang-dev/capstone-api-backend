import {Client, expect} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';
import {setupApplication} from './test-helper';
import {AccountRepository} from '../../repositories';

describe('AccountController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;
  let accountRepo: AccountRepository;

  const accountData = {
    username: 'john217',
    password: 'password',
    apikey: 'secretkey',
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    accountRepo = await app.getRepository(AccountRepository);
  });
  before(clearDatabase);

  after(async () => {
    await app.stop();
  });

  it('creates new account when POST /accounts/register is invoked', async () => {
    // Arrange
    const req = {...accountData};

    // Act
    const res = await client.post('/accounts/register').send(req).expect(200);

    // Assert
    expect(res.body.username).to.equal('john217');
  });

  it('login successfully', async () => {
    // Arrange
    const req = {
      username: accountData.username,
      password: accountData.password,
    };

    // Act
    const res = await client.post('/accounts/login').send(req).expect(204);

    // Assert
    expect(res.body).to.empty();
  });

  // Private helper functions
  async function clearDatabase() {
    await accountRepo.deleteAll();
  }
});
