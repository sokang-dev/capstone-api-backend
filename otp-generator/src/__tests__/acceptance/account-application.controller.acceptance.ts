import {Client, expect} from '@loopback/testlab';
import {OtpGeneratorApplication} from '../..';
import {AccountRepository, ApplicationRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('Account-ApplicationController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;
  let accountRepo: AccountRepository;
  let applicationRepo: ApplicationRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    accountRepo = await app.getRepository(AccountRepository);
    applicationRepo = await app.getRepository(ApplicationRepository);
  });
  beforeEach(clearDatabase);

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
      .expect(200);

    const getAllApplicationsFilteredRes = await client
      .get('/api/applications/?filter[where][accountId]=1')
      .expect(200);

    // Assert
    expect(getApplicationByIdRes.body === getAllApplicationsFilteredRes.body);
  });

  // Private helper functions
  async function clearDatabase() {
    await accountRepo.deleteAll();
    await applicationRepo.deleteAll();
  }
});
