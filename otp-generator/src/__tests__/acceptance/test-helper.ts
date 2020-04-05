import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';
import {AccountRepository, ApplicationRepository} from '../../repositories';
import {TestDbDataSource} from '../../datasources';

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
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export async function cleanTestDb() {
  let accountRepository: AccountRepository;
  let applicationRepository: ApplicationRepository;

  accountRepository = new AccountRepository(
    new TestDbDataSource(),
    async () => applicationRepository,
  );
  applicationRepository = new ApplicationRepository(
    new TestDbDataSource(),
    async () => accountRepository,
  );

  await Promise.all([
    accountRepository.deleteAll(),
    applicationRepository.deleteAll(),
  ]);
}

// export async function seedTestDb() {
//   let accountRepository: AccountRepository;
// }

export interface AppWithClient {
  app: OtpGeneratorApplication;
  client: Client;
}
