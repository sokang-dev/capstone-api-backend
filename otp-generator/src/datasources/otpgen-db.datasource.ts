import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './otpgen-db.datasource.config.json';

@lifeCycleObserver('datasource')
export class OtpgenDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'OtpgenDb';

  constructor(
    @inject('datasources.config.OtpgenDb', {optional: true})
    dsConfig: object = config,
  ) {
    // Override datesource config from environment variables
    Object.assign(dsConfig, {
      url: process.env.DB_URL,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
