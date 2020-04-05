import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './otpgen-db.datasource.config.json';

export class OtpgenDbDataSource extends juggler.DataSource {
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
}
