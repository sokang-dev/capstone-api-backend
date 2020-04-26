import {hasMany, model, property} from '@loopback/repository';
import {Application, ApplicationWithRelations} from './application.model';
import {TimestampEntity} from './TimestampEntity.model';

@model({
  settings: {
    idInjection: false,
    hiddenProperties: ['password'],
    mysql: {schema: 'otpgen', table: 'account'},
  },
})
export class Account extends TimestampEntity {
  @property({
    type: 'number',
    required: false,
    precision: 10,
    scale: 0,
    id: true,
    generated: true,
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
      columnName: 'username',
      dataType: 'varchar',
      dataLength: 255,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
    index: {
      unique: true,
    },
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    length: 255,
    mysql: {
      columnName: 'password',
      dataType: 'varchar',
      dataLength: 255,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    length: 255,
    mysql: {
      columnName: 'apikey',
      dataType: 'varchar',
      dataLength: 255,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  apikey: string;

  @hasMany(() => Application)
  applications?: Application[];

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export type Credentials = {
  username: string;
  password: string;
};

export interface AccountRelations {
  applications: ApplicationWithRelations[];
}

export type AccountWithRelations = Account & AccountRelations;
