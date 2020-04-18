import {Client, expect} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';
import {
  setupApplication,
  clearDatabase,
  registerAnAccount,
  authenticateAnAccount,
} from './test-helper';
import {Account} from '../../models';

describe('ApplicationUserController tests', () => {
  let app: OtpGeneratorApplication;
  let client: Client;
  let token: string;

  const accountData: Partial<Account> = {
    username: 'john217',
    password: 'password',
    apikey: 'secretkey',
  };

  const appUserData = {
    email: 'johnsmith@gmail.com',
    userSecret: 'rNONHRni6BAk7y2TiKrv',
    mobileNumber: '04162811',
    id: 1,
  };

  before('Setup application', async () => {
    ({app, client} = await setupApplication());
    await clearDatabase(app);
  });

  beforeEach('Get a valid JWT token', async () => {
    await registerAnAccount(client, accountData);
    token = await authenticateAnAccount(client, accountData);
  });

  after(async () => {
    await app.stop();
  });

  it('Create app user', async () => {
    // Arrange
    const req = appUserData;

    // Act
    const res = await client
      .post('/api/applicationusers')
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(200);

    // Assert
    expect(res.body.email).to.equal('johnsmith@gmail.com');
    expect(res.body.userSecret).to.equal('rNONHRni6BAk7y2TiKrv');
    expect(res.body.mobileNumber).to.equal('04162811');
  });

  it('Get app user by id returns an error when a JWT token is not provided', async () => {
    // Arrange
    const req = {...appUserData};

    // Act
    const res = await client.get('/api/applicationusers/' + req.id).send(req);

    // Assert
    expect(res.status).to.equal(401);
    expect(res.body.error.message).to.equal('Authorization header not found');
  });

  it('Get app user by id', async () => {
    // Arrange
    const req = {...appUserData};

    // Act
    const res = await client
      .get('/api/applicationusers/' + req.id)
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(200);

    // Assert
    expect(res.body.email).to.equal('johnsmith@gmail.com');
    expect(res.body.userSecret).to.equal('rNONHRni6BAk7y2TiKrv');
    expect(res.body.mobileNumber).to.equal('04162811');
  });

  it('Partial update app user by id', async () => {
    // Arrange
    const req = {...appUserData};

    // Act /Assert
    await client
      .patch('/api/applicationusers/' + req.id)
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(204);
  });

  it('Delete app user by id', async () => {
    // Arrange
    const req = {...appUserData};

    // Act
    const res = await client
      .delete('/api/applicationusers/' + req.id)
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(204);

    // Assert
    expect(res.body).empty();
  });
});
