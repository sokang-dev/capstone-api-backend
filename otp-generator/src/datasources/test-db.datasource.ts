import {inject, ValueOrPromise, lifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './test-db.datasource.config.json';

@lifeCycleObserver('datasource')
export class TestDbDataSource extends juggler.DataSource {
  static dataSourceName = 'TestDb';

  constructor(
    @inject('datasources.config.TestDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
