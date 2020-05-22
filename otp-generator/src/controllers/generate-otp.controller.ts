import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {OTPServiceBindings} from '../keys';
import {Applicationuser} from '../models';
import {ApplicationRepository, ApplicationuserRepository} from '../repositories';
import {OtpService} from '../services';

@authenticate('jwt')
export class GenerateOTPController {
  constructor(
    @repository(ApplicationuserRepository)
    public applicationuserRepository: ApplicationuserRepository,
    @repository(ApplicationRepository)
    public applicationRepository: ApplicationRepository,
    @inject(OTPServiceBindings.OTP_SERVICE)
    public otpService: OtpService
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
      throw new HttpErrors.BadRequest('Application User not found');
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
    const otp = this.otpService.generateOTP(applicationUser!, application!);

    //call sendOTP function
    this.otpService.sendOTP(otp, applicationUser);
  }

  @post('/otp/verify', {
    responses: {
      '204': {
        description: 'Verify OTP success',
      },
    },
  })
  async createVerify(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              appUserId:
              {
                type: 'number'
              },
              userOTP: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    applicationuser: Partial<Applicationuser>,
  ): Promise<boolean> {

    //Retrieve application user
    const applicationUser = await this.applicationuserRepository.findOne({
      where: {
        id: applicationuser.appUserId
      },
    });
  
    if (!applicationUser) {
      throw new HttpErrors.BadRequest('Application User not found');
    }

    //Retrieve application for the application user
    const application = await this.applicationRepository.findOne({
      where: {
        id: applicationUser.applicationId
      },
    });

    if (!application) {
      throw new HttpErrors.BadRequest('Application not found');
    }
    
    //Verify the application user's OTP
    return this.otpService.verifyOTP(applicationUser.userSecret, applicationuser.userOTP, 
      application.otpLifetime, application.otpLength);
  }
}
