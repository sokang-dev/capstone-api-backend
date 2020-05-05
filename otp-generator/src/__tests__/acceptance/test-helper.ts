import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {OtpGeneratorApplication} from '../..';
import {Account} from '../../models';
import {
  AccountRepository,
  ApplicationRepository,
  ApplicationuserRepository,
} from '../../repositories';

export interface AppWithClient {
  app: OtpGeneratorApplication;
  client: Client;
}

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new OtpGeneratorApplication({
    rest: restConfig,
  });

  await app.boot();

  // Bind to testing db
  app.bind('datasources.config.db').to({
    name: 'db',
    connector: 'memory',
  });

  await app.start();
  const client = createRestAppClient(app);

  return {app, client};
}

export async function setupAccountRepository(app: OtpGeneratorApplication) {
  const accountRepo = await app.getRepository(AccountRepository);

  return {accountRepo};
}

export async function setupApplicationRepository(app: OtpGeneratorApplication) {
  const applicationRepo = await app.getRepository(ApplicationRepository);

  return {applicationRepo};
}

export async function setupApplicationuserRepository(
  app: OtpGeneratorApplication,
) {
  const applicationuserRepo = await app.getRepository(
    ApplicationuserRepository,
  );

  return {applicationuserRepo};
}

export async function clearDatabase(app: OtpGeneratorApplication) {
  const accountRepo: AccountRepository = await app.getRepository(
    AccountRepository,
  );

  const applicationRepo: ApplicationRepository = await app.getRepository(
    ApplicationRepository,
  );

  const applicationuserRepo: ApplicationuserRepository = await app.getRepository(
    ApplicationuserRepository,
  );

  await accountRepo.deleteAll();
  await applicationRepo.deleteAll();
  await applicationuserRepo.deleteAll();
}

export async function registerAnAccount(
  client: Client,
  account: Partial<Account>,
) {
  const req = {
    username: account.username,
    password: account.password,
    apikey: account.apikey,
    role: account.role,
  };

  const res = await client.post('/api/accounts/register').send(req);
  return res;
}

export async function authenticateAnAccount(
  client: Client,
  account: Partial<Account>,
) {
  const req = {
    username: account.username,
    password: account.password,
  };

  const res = await client.post('/api/accounts/login').send(req);

  return res.body.token;
}
