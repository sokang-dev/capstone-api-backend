import {Client, expect} from '@loopback/testlab';
import {OtpGeneratorApplication} from '../..';
import {Account} from '../../models';
import {
  authenticateAnAccount,
  clearDatabase,
  registerAnAccount,
  setupApplication,
} from './test-helper';

describe('ApplicationController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;
  let token: string;

  const accountData: Partial<Account> = {
    username: 'john217',
    password: 'password',
    apikey: 'secretkey',
  };

  const testApplication = {
    applicationName: 'test application',
    accountId: 1,
    otpLength: 6,
    otpLifetime: 60,
  };

  before('Setup application', async () => {
    ({app, client} = await setupApplication());
    await registerAnAccount(client, accountData);
    token = await authenticateAnAccount(client, accountData);
  });

  beforeEach('Clear database', async () => {
    await clearDatabase(app);
  });

  after(async () => {
    await app.stop();
  });

  it('Create an Application returns an error when JWT token is not provided', async () => {
    // Arrange
    const req = {...testApplication};

    // Act
    const res = await client.post('/api/applications').send(req);

    // Assert
    expect(res.status).to.equal(401);
    expect(res.body.error.message).to.equal('Authorization header not found');
  });

  it('Get an Application', async () => {
    // Arrange
    const req = {...testApplication};
    const createRes = await client
      .post('/api/applications')
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(200);

    // Act
    const getRes = await client
      .get('/api/applications/' + createRes.body.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    // Assert
    expect(getRes.body.applicationName).to.equal('test application');
  });

  it('Create an Application', async () => {
    // Arrange
    const req = {...testApplication};

    // Act
    const res = await client
      .post('/api/applications')
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(200);

    // Assert
    expect(res.body.applicationName).to.equal('test application');
  });

  it('Update an Application field', async () => {
    // Arrange
    const old = {...testApplication};
    const updated = {
      applicationName: 'updated application',
    };
    const res = await client
      .post('/api/applications')
      .set('Authorization', 'Bearer ' + token)
      .send(old)
      .expect(200);

    await client
      .patch('/api/applications/' + res.body.id)
      .set('Authorization', 'Bearer ' + token)
      .send(updated)
      .expect(204);

    // Assert
    const get = await client
      .get('/api/applications/' + res.body.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(get.body.applicationName).to.equal('updated application');
  });

  it('Delete an Application', async () => {
    // Arrange
    const req = {...testApplication};
    const res = await client
      .post('/api/applications')
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(200);

    // Act
    await client
      .delete('/api/applications/' + res.body.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);

    // Assert
    await client
      .get('/api/applications/' + res.body.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  it('Get all Applications returns 401 error as a user', async () => {
    // Arrange
    const req = {...testApplication};

    // Act
    await client
      .post('/api/applications')
      .send(req)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    // Assert
    await client
      .get('/api/applications')
      .set('Authorization', 'Bearer ' + token)
      .expect(401);
  });

  it('Get all Applications returns applications as an admin', async () => {
    // Arrange
    const req = {...testApplication};
    // Register admin account
    await client.post('/api/accounts/register').send({
      username: 'admin',
      password: 'password',
      apikey: 'secret',
      role: 'admin',
    });
    // Login as admin
    const res = await client.post('/api/accounts/login').send({
      username: 'admin',
      password: 'password',
    });
    const adminToken = res.body.token;

    // Act
    await client
      .post('/api/applications')
      .send(req)
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200);

    // Assert
    await client
      .get('/api/applications')
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200);
  });
});
