import {Client, expect} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';
import {setupApplication} from './test-helper';
import {AccountRepository} from '../../repositories';
import {Credentials} from '../../models';

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
    const res = await client
      .post('/api/accounts/register')
      .send(req)
      .expect(200);

    // Assert
    expect(res.body.username).to.equal('john217');
    expect(res.body).to.not.have.property('password');
  });

  it('login returns a JWT token', async () => {
    // Arrange
    const req: Credentials = {
      username: accountData.username,
      password: accountData.password,
    };

    // Act
    const res = await client.post('/api/accounts/login').send(req);

    // Assert
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body.token).to.not.be.empty();
  });

  // Private helper functions
  async function clearDatabase() {
    await accountRepo.deleteAll();
  }
});
