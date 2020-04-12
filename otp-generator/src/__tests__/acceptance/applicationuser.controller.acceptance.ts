import {Client, expect} from '@loopback/testlab';

import {OtpGeneratorApplication} from '../..';
import {setupApplication} from './test-helper';
import {ApplicationuserRepository} from '../../repositories';

describe('ApplicationUserController', () => {
  let app: OtpGeneratorApplication;
  let client: Client;
  let appUserRepo: ApplicationuserRepository;

  const appUserData = {
    email: 'johnsmith@gmail.com',
    userSecret: 'rNONHRni6BAk7y2TiKrv',
    mobileNumber: '04162811',
    id: 1,
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    appUserRepo = await app.getRepository(ApplicationuserRepository);
  });
  before(clearDatabase);

  after(async () => {
    await app.stop();
  });

  it('Create app user', async () => {
    // Arrange
    const req = appUserData;

    // Act
    const res = await client
      .post('/api/applicationusers')
      .send(req)
      .expect(200);

    // Assert
    expect(res.body.email).to.equal('johnsmith@gmail.com');
    expect(res.body.userSecret).to.equal('rNONHRni6BAk7y2TiKrv');
    expect(res.body.mobileNumber).to.equal('04162811');
  });

  it('Get app user by id', async () => {
    // Arrange
    const req = {...appUserData};

    // Act
    const res = await client
      .get('/api/applicationusers/' + req.id)
      .send(req)
      .expect(200);

    // Assert
    expect(res.body.email).to.equal('johnsmith@gmail.com');
    expect(res.body.userSecret).to.equal('rNONHRni6BAk7y2TiKrv');
    expect(res.body.mobileNumber).to.equal('04162811');
  });

  it('Partial update app user by id', async () => {
    // Arrange
    const req = {...appUserData};

    // Act /Assert
    await client
      .patch('/api/applicationusers/' + req.id)
      .send(req)
      .expect(204);
  });

  it('Delete app user by id', async () => {
    // Arrange
    const req = {...appUserData};

    // Act
    const res = await client
      .delete('/api/applicationusers/' + req.id)
      .send(req)
      .expect(204);

    // Assert
    expect(res.body).to.not.have.property('id');
  });

  // Private helper functions
  async function clearDatabase() {
    await appUserRepo.deleteAll();
  }
});
