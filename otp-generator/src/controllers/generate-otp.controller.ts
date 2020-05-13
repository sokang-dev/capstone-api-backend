import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import speakeasy from 'speakeasy';
import {Applicationuser} from '../models';
import {ApplicationuserRepository} from '../repositories';

@authenticate('jwt')
export class GenerateOTPController {
  constructor(
    @repository(ApplicationuserRepository)
    public applicationuserRepository: ApplicationuserRepository,
  ) {}

  @get('/onetimepassword/{id}', {
    responses: {
      '200': {
        description: 'Applicationuser model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Applicationuser, {
              includeRelations: true,
            }),
          },
        },
      },
    },
  })
  async findOneTimePasswordByUserId(
    @param.path.number('id') id: typeof Applicationuser.prototype.id,
  ): Promise<string> {
    const applicationUser = await this.applicationuserRepository.findById(id);
    if (applicationUser?.userSecret) {
      const onetimepassword = speakeasy.totp({
        secret: applicationUser.userSecret,
        encoding: 'base32',
      });
      return onetimepassword;
    }
    return '';
  }
}
