import {Client, expect} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';
import {setupApplication, givenEmptyDb} from './test-helper';

describe('AccountController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;

  const accountData = {
    username: 'john217',
    password: 'password',
    apikey: 'secretkey',
  };

  before(givenEmptyDb);
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('creates new account when POST /accounts/register is invoked', async () => {
    // Arrange
    const req = {...accountData};
    console.log(req);

    // Act
    const res = await client.post('/accounts/register').send(req).expect(200);

    // Assert
    expect(res.body.username).to.equal('john217');
  });
});
