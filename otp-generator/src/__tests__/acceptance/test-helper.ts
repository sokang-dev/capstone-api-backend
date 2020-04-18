import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {RestApplication} from '@loopback/rest';

import {OtpGeneratorApplication} from '../..';
import {juggler, DefaultCrudRepository} from '@loopback/repository';
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

export async function setupAccountRepositories(app: OtpGeneratorApplication) {
  const accountRepo = await app.getRepository(AccountRepository);

  return {accountRepo};
}

export async function setupApplicatioRepositories(
  app: OtpGeneratorApplication,
) {
  const applicationRepo = await app.getRepository(ApplicationRepository);

  return {applicationRepo};
}

export async function setupApplicationuserRepositories(
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

  accountRepo.deleteAll();
  applicationRepo.deleteAll();
  applicationuserRepo.deleteAll();
}

const testdb: juggler.DataSource = new juggler.DataSource({
  name: 'db',
  connector: 'memory',
});
