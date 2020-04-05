import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';
import {AccountRepository, ApplicationRepository} from '../../repositories';
import {testdb} from '../datasources/test-db.datasource';

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

  app.bind('datasources.config.db').to({
    name: 'db',
    connector: 'memory',
  });

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export async function givenEmptyDb() {
  let accountRepository: AccountRepository;
  let applicationRepository: ApplicationRepository;

  accountRepository = new AccountRepository(
    testdb,
    async () => applicationRepository,
  );
  applicationRepository = new ApplicationRepository(
    testdb,
    async () => accountRepository,
  );

  await accountRepository.deleteAll();
}

// export async function seedTestDb() {
//   let accountRepository: AccountRepository;
// }

export interface AppWithClient {
  app: OtpGeneratorApplication;
  client: Client;
}
