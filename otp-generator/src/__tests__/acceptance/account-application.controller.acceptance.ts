import {Client, expect} from '@loopback/testlab';
import * as bcrypt from 'bcrypt';
import {OtpGeneratorApplication} from '../..';
import {AccountRepository, ApplicationRepository} from '../../repositories';
import {
  clearDatabase,
  setupAccountRepository,
  setupApplication,
  setupApplicationRepository,
} from './test-helper';

describe('Account-ApplicationController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;
  let accountRepo: AccountRepository;
  let applicationRepo: ApplicationRepository;

  before('Setup application', async () => {
    ({app, client} = await setupApplication());
    ({accountRepo} = await setupAccountRepository(app));
    ({applicationRepo} = await setupApplicationRepository(app));
  });

  beforeEach('Clear database', async () => {
    await clearDatabase(app);
  });

  // beforeEach('Get a valid JWT token', async () => {
  //   await registerAnAccount(client, account);
  //   token = await authenticateAnAccount(client, account);
  // });

  after(async () => {
    await app.stop();
  });

  it('Get Applications belonging to an Account', async () => {
    // Arrange
    const plainPassword = 'password';
    const hashPassword = bcrypt.hashSync(plainPassword, 10);
    // Create Account
    const accountData = {
      username: 'john217',
      password: hashPassword,
    };
    const accountData2 = {
      username: 'john219',
      password: hashPassword,
    };
    await accountRepo.create(accountData);
    //Create a second account
    await accountRepo.create(accountData2);

    //Create Applications
    const testApplication = {
      applicationName: 'test application',
      accountId: 1,
      otpLength: 6,
      otpLifetime: 60,
    };
    await applicationRepo.create(testApplication);
    await applicationRepo.create(testApplication);

    //Assign this application to the second account
    const testApplication2 = {
      applicationName: 'test application',
      accountId: 2,
      otpLength: 6,
      otpLifetime: 60,
    };
    await applicationRepo.create(testApplication2);

    // Login with account id 1
    const res = await client
      .post('/api/accounts/login')
      .send({
        username: accountData.username,
        password: plainPassword,
      })
      .expect(200);
    const token = res.body.token;
    const accountId = res.body.userProfile.id;

    // Act
    // Expect to get 401 when getting other account info
    await client
      .get('/api/accounts/2/applications')
      .set('Authorization', 'Bearer ' + token)
      .expect(401);

    const getApplicationByIdRes = await client
      .get(`/api/accounts/${accountId}/applications`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    const apps = await applicationRepo.find({
      where: {
        accountId,
      },
    });

    // Assert
    expect(getApplicationByIdRes.body === apps);
  });

  it('Get Applications returns an error when JWT token is not provided', async () => {
    // Act
    const res = await client.get('/api/accounts/1/applications');

    // Arrange
    expect(res.status).to.equal(401);
    expect(res.body.error.message).to.equal('Authorization header not found');
  });
});
