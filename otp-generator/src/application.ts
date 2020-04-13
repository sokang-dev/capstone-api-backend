import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
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
import {TokenServiceConstants, TokenServiceBindings} from './keys';

export class OtpGeneratorApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

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

    // Load authentication component
    this.component(AuthenticationComponent);

    // Set up the custom sequence
    this.sequence(MySequence);
  }

  setupBindings(): void {
    this.bind(TokenServiceBindings.JWT_SECRET).to(
      TokenServiceConstants.JWT_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.JWT_LIFESPAN).to(
      TokenServiceConstants.JWT_LIFESPAN_VALUE,
    );
  }
}
