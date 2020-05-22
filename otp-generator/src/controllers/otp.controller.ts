import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {OTPServiceBindings} from '../keys';
import {Applicationuser} from '../models';
import {ApplicationRepository, ApplicationuserRepository} from '../repositories';
import {OtpService} from '../services';

@authenticate('jwt')
export class OTPController {
  constructor(
    @repository(ApplicationuserRepository)
    public applicationuserRepository: ApplicationuserRepository,
    @repository(ApplicationRepository)
    public applicationRepository: ApplicationRepository,
    @inject(OTPServiceBindings.OTP_SERVICE)
    public otpService: OtpService,
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
              applicationId: {
                type: 'number',
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
    //Retrieve application user
    const applicationUser = await this.applicationuserRepository.findOne({
      where: {
        email: applicationuser.appUserEmail,
        applicationId: applicationuser.applicationId,
      },
    });

    if (!applicationUser) {
      throw new HttpErrors.BadRequest('Application User not found');
    }

    //Retrieve application for the application user
    const application = await this.applicationRepository.findOne({
      where: {
        id: applicationuser.applicationId,
      },
    });

    if (!application) {
      throw new HttpErrors.BadRequest('Application not found');
    }

    //call generateOTP function
    const otp = this.otpService.generateOTP(
      applicationUser.userSecret,
      application.otpLength,
      application.otpLifetime,
    );

    //call sendOTP function
    await this.otpService.sendOTP(otp, applicationUser.mobileNumber);
  }

  @post('/otp/verify', {
    responses: {
      '200': {
        description: 'Verify OTP validity',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                isOtpValid: {
                  type: 'boolean',
                },
              },
            },
          },
        },
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
              applicationId: {
                type: 'number',
              },
              appUserEmail: {
                type: 'string',
              },
              userOTP: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    verifyOtpRequest: VerifyOtpRequest,
  ): Promise<boolean> {
    //Retrieve application user
    const applicationUser = await this.applicationuserRepository.findOne({
      where: {
        email: verifyOtpRequest.appUserEmail,
        applicationId: verifyOtpRequest.applicationId,
      },
    });

    if (!applicationUser) {
      throw new HttpErrors.BadRequest('Application User not found');
    }

    //Retrieve application for the application user
    const application = await this.applicationRepository.findOne({
      where: {
        id: verifyOtpRequest.applicationId,
      },
    });

    if (!application) {
      throw new HttpErrors.BadRequest('Application not found');
    }

    //Verify the application user's OTP
    return this.otpService.verifyOTP(
      applicationUser.userSecret,
      verifyOtpRequest.userOTP,
      application.otpLifetime,
      application.otpLength,
    );
  }
}

export type VerifyOtpRequest = {
  applicationId: number;
  appUserEmail: string;
  userOTP: string;
};
