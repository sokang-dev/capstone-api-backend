import {AuthenticationComponent} from '@loopback/authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationOptions,
  AuthorizationTags,
} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import dotenv from 'dotenv';
import path from 'path';
import {JWTAuthenticationStrategy} from './jwt-strategy';
import {
  AccountServiceBindings,
  JWTServiceBindings,
  JWTServiceConstants,
  OTPServiceBindings,
} from './keys';
import {MySequence} from './sequence';
import {AccountService, JwtService, OtpService} from './services';
import {BasicAuthorizer} from './services/authorizer.service';

export class OtpGeneratorApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    dotenv.config();

    this.setupBindings();

    // Setup Authentication and Authorization
    this.setupAuth();

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

  setupAuth(): void {
    // Load authentication component
    this.component(AuthenticationComponent);
    this.add(createBindingFromClass(JWTAuthenticationStrategy));

    // Load authorisation component
    const authorizationOptions: AuthorizationOptions = {
      // Default decision if all authorizers vote for ABSTAIN
      defaultDecision: AuthorizationDecision.DENY,
      // Deny vote will take precedence and override other votes
      precedence: AuthorizationDecision.DENY,
    };
    this.configure(AuthorizationBindings.COMPONENT).to(authorizationOptions);
    this.component(AuthorizationComponent);
    this.bind('authorizationProviders.basic-authorizer')
      .toProvider(BasicAuthorizer)
      .tag(AuthorizationTags.AUTHORIZER);
  }
}
