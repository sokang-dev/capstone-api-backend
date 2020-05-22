import {Client, expect} from '@loopback/testlab';
import {OtpGeneratorApplication} from '../..';
import {Account, Application} from '../../models';
import {ApplicationRepository} from '../../repositories';
import {
  authenticateAnAccount,
  clearDatabase,
  registerAnAccount,
  setupApplication,
  setupApplicationRepository,
} from './test-helper';

describe('ApplicationUserController tests', () => {
  let app: OtpGeneratorApplication;
  let applicationRepo: ApplicationRepository;
  let client: Client;
  let token: string;

  const accountData: Partial<Account> = {
    username: 'john217',
    password: 'password',
  };

  const appData: Partial<Application> = {
    applicationName: 'test app',
    accountId: 1,
  };

  const appUserData = {
    email: 'johnsmith@gmail.com',
    mobileNumber: '04162811',
    id: 1,
    applicationId: 1,
  };

  before('Setup application', async () => {
    ({app, client} = await setupApplication());
    ({applicationRepo} = await setupApplicationRepository(app));
    await clearDatabase(app);
    await createApp();
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
    const req = {
      email: appUserData.email,
      mobileNumber: appUserData.mobileNumber,
      applicationId: 1,
    };

    // Act
    const res = await client
      .post('/api/applicationusers')
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(200);

    // Assert
    expect(res.body.email).to.equal('johnsmith@gmail.com');
    expect(res.body.mobileNumber).to.equal('04162811');
    expect(res.body.userSecret).not.empty();
  });

  it('Get app user by id returns an error when JWT token is not provided', async () => {
    // Act
    const res = await client.get('/api/applicationusers/' + appUserData.id);

    // Assert
    expect(res.status).to.equal(401);
    expect(res.body.error.message).to.equal('Authorization header not found');
  });

  it('Get app user by id', async () => {
    // Act
    const res = await client
      .get('/api/applicationusers/' + appUserData.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    // Assert
    expect(res.body.email).to.equal('johnsmith@gmail.com');
    expect(res.body.mobileNumber).to.equal('04162811');
    expect(res.body.userSecret).not.empty();
  });

  it('Partial update of app user email by id', async () => {
    //Arrange
    const req = {
      email: appUserData.email,
      mobileNumber: appUserData.mobileNumber,
    };

    req.email = 'johnsmith23@gmail.com';

    // Act
    await client
      .patch('/api/applicationusers/' + appUserData.id)
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(204);

    const res = await client
      .get('/api/applicationusers/' + appUserData.id)
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(200);

    //Assert
    expect(res.body.email).to.equal('johnsmith23@gmail.com');
  });

  it('Delete app user by id', async () => {
    // Arrange
    const req = {
      email: appUserData.email,
      mobileNumber: appUserData.mobileNumber,
    };

    // Act
    await client
      .delete('/api/applicationusers/' + appUserData.id)
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(204);

    //Assert
    await client
      .get('/api/applicationusers/' + appUserData.id)
      .set('Authorization', 'Bearer ' + token)
      .send(req)
      .expect(404);
  });

  async function createApp() {
    await applicationRepo.create(appData);
  }
});
