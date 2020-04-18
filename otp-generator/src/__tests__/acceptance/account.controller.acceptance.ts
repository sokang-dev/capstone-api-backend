import {Client, expect} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';
import {setupApplication, clearDatabase} from './test-helper';
import {Credentials} from '../../models';

describe('AccountController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;

  const accountData = {
    username: 'john217',
    password: 'password',
    apikey: 'secretkey',
  };

  before('Setup Application', async () => {
    ({app, client} = await setupApplication());
  });

  before('Clear Database', async () => {
    await clearDatabase(app);
  });

  after(async () => {
    await app.stop();
  });

  it(`POST '/accounts/register' creates a new account`, async () => {
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

  describe(`GET '/accounts'`, () => {
    it(`GET '/accounts' returns all accounts when a valid JWT token is provided`, async () => {
      // Arrange
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
});
