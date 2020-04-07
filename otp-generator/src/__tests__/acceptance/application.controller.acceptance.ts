import {Client, expect} from '@loopback/testlab';
import {OtpGeneratorApplication} from '../..';
import {ApplicationRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('ApplicationController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;
  let applicationRepo: ApplicationRepository;

  const testApplication = {
    applicationName: 'test application',
    accountId: 1,
    otpLength: 6,
    otpLifetime: 60,
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    applicationRepo = await app.getRepository(ApplicationRepository);
  });
  before(clearDatabase);

  after(async () => {
    await app.stop();
  });

  it('Get an Application', async () => {
    // Arrange
    const req = {...testApplication};
    const res = await client.post('/applications').send(req).expect(200);

    // Act
    await client
      .get('/applications/' + res.body.id)
      .send(req)
      .expect(200);

    // Assert
    expect(res.body.applicationName).to.equal('test application');
  });

  it('Create an Application', async () => {
    // Arrange
    const req = {...testApplication};

    // Act
    const res = await client.post('/applications').send(req).expect(200);

    // Assert
    expect(res.body.applicationName).to.equal('test application');
  });

  it('Update an Application field', async () => {
    // Arrange
    const old = {...testApplication};
    const updated = {
      applicationName: 'updated application',
    };
    await applicationRepo.create(old);

    await client.patch('/applications/1').send(updated).expect(204);

    // Assert
    const get = await client.get('/applications/1').expect(200);
    expect(get.body.applicationName).to.equal('updated application');
  });

  it('Delete an Application', async () => {
    // Arrange
    const req = {...testApplication};
    await applicationRepo.create(req);

    // Act
    await client.delete('/applications/1').expect(204);

    // Assert
    await client.get('/applications/1').expect(404);
  });

  it('Get all Applications', async () => {
    // Arrange
    const req = {...testApplication};

    // Act
    await client.post('/applications').send(req).expect(200);

    // Assert
    await client.get('/applications').expect(200);
  });

  // Private helper functions
  async function clearDatabase() {
    await applicationRepo.deleteAll();
  }
});
