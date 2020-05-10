import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {AuthenticationComponent} from '@loopback/authentication';

import {MySequence} from './sequence';
import {
  JWTServiceConstants,
  JWTServiceBindings,
  AccountServiceBindings,
  OTPServiceBindings,
} from './keys';
import {JwtService, AccountService, OtpService} from './services';
import {JWTAuthenticationStrategy} from './jwt-strategy';

export class OtpGeneratorApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.setupBindings();

    // Load authentication component
    this.component(AuthenticationComponent);
    this.add(createBindingFromClass(JWTAuthenticationStrategy));

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up API base path
    this.basePath('/api');

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBindings(): void {
    // Bind JWT secret and lifespan
    this.bind(JWTServiceBindings.JWT_SECRET).to(
      JWTServiceConstants.JWT_SECRET_VALUE,
    );
    this.bind(JWTServiceBindings.JWT_LIFESPAN).to(
      JWTServiceConstants.JWT_LIFESPAN_VALUE,
    );

    // Bind JWT service
    this.bind(JWTServiceBindings.JWT_SERVICE).toClass(JwtService);

    // Bind Account service
    this.bind(AccountServiceBindings.ACCOUNT_SERVICE).toClass(AccountService);

    //Bind OTP service
    this.bind(OTPServiceBindings.OTP_SERVICE).toClass(OtpService);
  }
}
