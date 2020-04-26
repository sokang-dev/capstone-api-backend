import {Client, expect} from '@loopback/testlab';
import {OtpGeneratorApplication} from '../..';
import {AccountRepository, ApplicationRepository} from '../../repositories';
import {
  setupApplication,
  clearDatabase,
  registerAnAccount,
  authenticateAnAccount,
  setupAccountRepository,
  setupApplicationRepository,
} from './test-helper';
import {Account} from '../../models';

describe('Account-ApplicationController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;
  let accountRepo: AccountRepository;
  let applicationRepo: ApplicationRepository;
  let token: string;

  const account: Partial<Account> = {
    username: 'john doe',
    password: 'password',
    apikey: 'secretkey',
  };

  before('Setup application', async () => {
    ({app, client} = await setupApplication());
    ({accountRepo} = await setupAccountRepository(app));
    ({applicationRepo} = await setupApplicationRepository(app));
  });

  beforeEach('Clear database', async () => {
    await clearDatabase(app);
  });

  beforeEach('Get a valid JWT token', async () => {
    await registerAnAccount(client, account);
    token = await authenticateAnAccount(client, account);
  });

  after(async () => {
    await app.stop();
  });

  it('Get Applications belonging to an Account', async () => {
    // Arrange
    //Create Account
    const accountData = {
      username: 'john217',
      password: 'password',
      apikey: 'secretkey',
    };
    const accountData2 = {
      username: 'john219',
      password: 'password',
      apikey: 'secretkey',
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

    // Act
    const getApplicationByIdRes = await client
      .get('/api/accounts/1/applications/')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    const getAllApplicationsFilteredRes = await client
      .get('/api/applications/?filter[where][accountId]=1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    // Assert
    expect(getApplicationByIdRes.body === getAllApplicationsFilteredRes.body);
  });

  it('Get Applications returns an error when JWT token is not provided', async () => {
    // Act
    const res = await client.get('/api/accounts/1/applications');

    // Arrange
    expect(res.status).to.equal(401);
    expect(res.body.error.message).to.equal('Authorization header not found');
  });
});
