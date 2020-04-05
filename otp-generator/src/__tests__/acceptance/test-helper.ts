import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';

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

export interface AppWithClient {
  app: OtpGeneratorApplication;
  client: Client;
}
