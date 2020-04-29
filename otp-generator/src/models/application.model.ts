/* eslint @typescript-eslint/camelcase: 0 */

import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {Account, AccountWithRelations} from './account.model';
import {Applicationuser} from './applicationuser.model';
import {TimestampEntity} from './TimestampEntity.model';

@model({
  settings: {
    idInjection: false,
    mysql: {schema: 'otpgen', table: 'application'},
    foreignKeys: {
      fk_application_accountId: {
        name: 'fk_application_accountId',
        entity: 'Account',
        entityKey: 'id',
        foreignKey: 'accountId',
      },
    },
  },
})
export class Application extends TimestampEntity {
  @property({
    type: 'number',
    required: false,
    precision: 10,
    scale: 0,
    id: true,
    generated: true,
    mysql: {
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
    },
  })
  id: number;

  @property({
    type: 'string',
    required: true,
    length: 255,
    mysql: {
      dataType: 'varchar',
      dataLength: 255,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  applicationName: string;

  @belongsTo(() => Account)
  accountId: number;

  @property({
    type: 'string',
    required: false,
    length: 255,
    mysql: {
      dataType: 'varchar',
      dataLength: 255,
      nullable: 'Y',
    },
  })
  applicationDescription?: string;

  @property({
    type: 'number',
    required: false,
    precision: 10,
    scale: 0,
    default: 6,
    mysql: {
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
    },
  })
  otpLength: number;

  @property({
    type: 'number',
    required: false,
    precision: 10,
    scale: 0,
    default: 60,
    mysql: {
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
    },
  })
  otpLifetime: number;

  @hasMany(() => Applicationuser)
  applicationusers?: Applicationuser[];

  constructor(data?: Partial<Application>) {
    super(data);
  }
}

export interface ApplicationRelations {
  account: AccountWithRelations;
}

export type ApplicationWithRelations = Application & ApplicationRelations;
