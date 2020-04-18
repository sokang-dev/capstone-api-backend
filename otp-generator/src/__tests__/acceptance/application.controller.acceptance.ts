import {Client, expect} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';
import {
  setupApplication,
  clearDatabase,
  registerAnAccount,
  authenticateAnAccount,
} from './test-helper';
import {Account} from '../../models';

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

  before('Setup Application', async () => {
    ({app, client} = await setupApplication());
  });

  beforeEach('Clear Database', async () => {
    await clearDatabase(app);
  });

  beforeEach('Get a valid JWT token', async () => {
    await registerAnAccount(client, accountData);
    token = await authenticateAnAccount(client, accountData);
  });

  after(async () => {
    await app.stop();
  });

  it('Get an Application', async () => {
    // Arrange
    const req = {...testApplication};
    const res = await client
      .post('/api/applications')
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(200);

    // Act
    await client
      .get('/api/applications/' + res.body.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    // Assert
    expect(res.body.applicationName).to.equal('test application');
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

  it('Get all Applications', async () => {
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
      .expect(200);
  });
});
