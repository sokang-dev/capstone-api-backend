import {Client, expect} from '@loopback/testlab';
import {OtpGeneratorApplication} from '../..';
import {Credentials} from '../../models';
import {
  clearDatabase,
  registerAnAccount,
  setupApplication,
} from './test-helper';

describe('AccountController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;

  const accountData = {
    username: 'john217',
    password: 'password',
    apikey: 'secretkey',
  };

  const accountData2 = {
    username: 'jane777',
    password: 'qweas',
    apikey: 'secretkey',
  };

  const adminAccountData = {
    username: 'admin',
    password: 'p4$$w0rd',
    apikey: 'secretkey',
    role: 'admin',
  };

  before('Setup Application', async () => {
    ({app, client} = await setupApplication());
    await clearDatabase(app);
    await registerAnAccount(client, adminAccountData); // Register an admin account - id 1
    await registerAnAccount(client, accountData); // Register an user account - id 2
    await registerAnAccount(client, accountData2); // Register an user account - id 3
  });

  // beforeEach('Clear database and setup accounts', async () => {
  //   await clearDatabase(app);
  //   await registerAnAccount(client, adminAccountData); // Register an admin account - id 1
  //   await registerAnAccount(client, accountData); // Register an user account - id 2
  //   await registerAnAccount(client, accountData); // Register an user account - id 3
  // });

  after(async () => {
    await app.stop();
  });

  it(`POST '/accounts/register' creates a new account`, async () => {
    // Arrange
    const req = {
      username: 'john200',
      password: 'wqeasd',
      apikey: 'secret',
    };

    // Act
    const res = await client
      .post('/api/accounts/register')
      .send(req)
      .expect(200);

    // Assert
    expect(res.body.username).to.equal('john200');
    expect(res.body).to.not.have.property('password');
  });

  describe(`POST '/accounts/login'`, () => {
    const credentialsError = 'Incorrect login credentials';

    it(`POST '/accounts/login' returns a JWT token when successful`, async () => {
      // Arrange
      const req: Credentials = {
        username: accountData.username,
        password: accountData.password,
      };

      // Act
      const res = await client.post('/api/accounts/login').send(req);

      // Assert
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('userProfile');
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.not.be.empty();
    });

    it(`POST '/accounts/login' returns an error with non-existent username`, async () => {
      // Arrange
      const req: Credentials = {
        username: 'wronggg!!',
        password: accountData.password,
      };

      // Act
      const res = await client.post('/api/accounts/login').send(req);

      // Assert
      expect(res.status).to.equal(401); // Unauthorized
      expect(res.body.error.message).to.equal(credentialsError);
    });

    it(`POST '/accounts/login' returns an error with incorrect password`, async () => {
      // Arrange
      const req: Credentials = {
        username: accountData.username,
        password: 'wronggg!!',
      };

      // Act
      const res = await client.post('/api/accounts/login').send(req);

      // Assert
      expect(res.status).to.equal(401); // Unauthorized
      expect(res.body.error.message).to.equal(credentialsError);
    });
  });

  describe(`GET '/accounts' Authentication tests`, () => {
    it(`GET '/accounts/:id' returns account info when a valid JWT token is provided`, async () => {
      // Arrange
      let res = await client.post('/api/accounts/login').send({
        username: accountData.username,
        password: accountData.password,
      });
      const token = res.body.token;
      const accountId = res.body.userProfile.id;

      // Act
      res = await client
        .get(`/api/accounts/${accountId}`)
        .set('Authorization', 'Bearer ' + token);

      // Assert
      expect(res.status).to.equal(200);
    });

    it(`GET '/accounts' returns an error when JWT token is not provided`, async () => {
      // Act
      const res = await client.get('/api/accounts');

      // Assert
      expect(res.status).to.equal(401);
      expect(res.body.error.message).to.equal('Authorization header not found');
    });

    it(`GET '/accounts' returns an error when an invalid JWT token is not provided`, async () => {
      // Act
      const res = await client
        .get('/api/accounts')
        .set('Authorization', 'Wronggg ' + 'xx.yy.zz');

      // Assert
      expect(res.status).to.equal(401);
      expect(res.body.error.message).to.equal(
        `Authorization header does not have the pattern: 'Bearer xx.yy.zz'`,
      );
    });
  });

  describe(`GET '/accounts' Authorisation tests`, () => {
    it(`GET '/accounts' returns 401 error when an user account hits it`, async () => {
      // Arrange
      // Logins with user account
      let res = await client.post('/api/accounts/login').send({
        username: accountData.username,
        password: accountData.password,
      });
      const token = res.body.token;

      // Act
      res = await client
        .get('/api/accounts')
        .set('Authorization', 'Bearer ' + token);

      // Assert
      expect(res.status).to.equal(401);
    });

    it(`GET '/accounts' returns accounts when an admin account hits it`, async () => {
      // Arrange
      // Logins with admin account
      let res = await client.post('/api/accounts/login').send({
        username: adminAccountData.username,
        password: adminAccountData.password,
      });
      const token = res.body.token;

      // Act
      res = await client
        .get('/api/accounts')
        .set('Authorization', 'Bearer ' + token);

      // Assert
      expect(res.status).to.equal(200);
    });

    it(`GET '/accounts/:id' returns 401 error when non-owner hits it`, async () => {
      // Arrange
      // Logins with an user account of id 2
      let res = await client
        .post('/api/accounts/login')
        .send({
          username: accountData.username,
          password: accountData.password,
        })
        .expect(200);
      const token = res.body.token;

      // Act
      // Try to fetch account id 1 while loggged in as account id 2
      res = await client
        .get(`/api/accounts/1`)
        .set('Authorization', 'Bearer ' + token);

      // Assert
      expect(res.status).to.equal(401);
    });
  });
});
