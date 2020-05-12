import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import speakeasy from 'speakeasy';
import {Application, Applicationuser} from '../models';
import {ApplicationRepository, ApplicationuserRepository} from '../repositories';

@authenticate('jwt')
export class GenerateOTPController {
  constructor(
    @repository(ApplicationuserRepository)
    public applicationuserRepository: ApplicationuserRepository,
    @repository(ApplicationRepository)
    public applicationRepository: ApplicationRepository
  ) {}

  @post('/otp/generate', {
    responses: {
      '204': {
        description: 'Generate and send OTP success',
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              applicationId:
              {
                type: 'number'
              },
              appUserEmail: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    applicationuser: Partial<Applicationuser>,
  ): Promise<void> {

    const applicationUser = await this.applicationuserRepository.findOne({
      where: {
        email: applicationuser.appUserEmail,
        applicationId: applicationuser.applicationId
      },
    });

    if (!applicationUser) {
      throw new HttpErrors.BadRequest('Application not found');
    }

    const application = await this.applicationRepository.findOne({
      where: {
        id: applicationuser.applicationId
      },
    });

    if (!application) {
      throw new HttpErrors.BadRequest('Application not found');
    }

    //call generateOTP function
    const otp = this.generateOTP(applicationUser!, application!);

    //call sendOTP function
    this.sendOTP(otp, applicationUser);
  }

  //function that generates OTP using speakeasy library
  generateOTP
    (appUser: Applicationuser, application: Application)
    : string {
    const onetimepassword = speakeasy.totp({
      secret: appUser.userSecret,
      encoding: 'base32',
      digits: application.otpLength,
      step: application.otpLifetime
    });
    return onetimepassword;
  }

  //function that sends OTP to developer
  async sendOTP(userOTP: string, appUser: Applicationuser)
    : Promise<void> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = require('twilio')(accountSid, authToken);

    client.messages
      .create({
        body: 'One Time Password:' + userOTP,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: appUser.mobileNumber
      })
      .then((message: any) => console.log(message.sid));
  }

}
