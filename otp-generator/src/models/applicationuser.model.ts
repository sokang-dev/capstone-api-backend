import {model, property, belongsTo} from '@loopback/repository';
import {BaseEntity} from './BaseEntity.model';
import {Application} from './application.model';

@model({
  settings: {
    idInjection: false,
    mysql: {schema: 'otpgen', table: 'applicationuser'},
  },
})
export class Applicationuser extends BaseEntity {
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

  @belongsTo(
    () => Application,
    {
      keyFrom: 'Applicationuser.applicationId',
      keyTo: 'Application.id',
    },
    {name: 'application_id'},
  )
  applicationId: number;

  @property({
    type: 'string',
    required: true,
    length: 255,
    mysql: {
      columnName: 'email',
      dataType: 'varchar',
      dataLength: 255,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  email: string;

  @property({
    type: 'string',
    length: 255,
    mysql: {
      columnName: 'username',
      dataType: 'varchar',
      dataLength: 255,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
    },
  })
  username?: string;

  @property({
    type: 'string',
    required: true,
    length: 255,
    mysql: {
      columnName: 'user_secret',
      dataType: 'varchar',
      dataLength: 255,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  userSecret: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    mysql: {
      columnName: 'mobile_number',
      dataType: 'varchar',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  mobileNumber: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Applicationuser>) {
    super(data);
  }
}

export interface ApplicationuserRelations {
  // describe navigational properties here
}

export type ApplicationuserWithRelations = Applicationuser &
  ApplicationuserRelations;
