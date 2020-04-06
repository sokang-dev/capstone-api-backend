import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {Account, AccountWithRelations} from './account.model';
import {Applicationuser} from './applicationuser.model';
import {TimestampEntity} from './TimestampEntity.model';

@model({
  settings: {
    idInjection: false,
    mysql: {schema: 'otpgen', table: 'application'},
  },
})
export class Application extends TimestampEntity {
  @property({
    type: 'number',
    required: false,
    precision: 10,
    scale: 0,
    id: true,
    mysql: {
      columnName: 'id',
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
      columnName: 'application_name',
      dataType: 'varchar',
      dataLength: 255,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  applicationName: string;

  @belongsTo(
    () => Account,
    {
      keyFrom: 'Application.accountId',
      keyTo: 'Account.Id',
    },
    {name: 'account_id'},
  )
  accountId: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    mysql: {
      columnName: 'otp_length',
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
    required: true,
    precision: 10,
    scale: 0,
    mysql: {
      columnName: 'otp_lifetime',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
    },
  })
  otpLifetime: number;

  @hasMany(() => Applicationuser, {keyTo: 'Application.Id'})
  applicationusers?: Applicationuser[];

  constructor(data?: Partial<Application>) {
    super(data);
  }
}

export interface ApplicationRelations {
  account: AccountWithRelations;
}

export type ApplicationWithRelations = Application & ApplicationRelations;
