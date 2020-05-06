/* eslint @typescript-eslint/camelcase: 0 */

import {belongsTo, model, property} from '@loopback/repository';
import {Application} from './application.model';
import {TimestampEntity} from './TimestampEntity.model';

@model({
  settings: {
    idInjection: false,
    mysql: {schema: 'otpgen', table: 'applicationuser'},
    foreignKeys: {
      fk_applicationuser_applicationId: {
        name: 'fk_applicationuser_applicationId',
        entity: 'Application',
        entityKey: 'id',
        foreignKey: 'applicationId',
      },
    },
  },
})
export class Applicationuser extends TimestampEntity {
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

  @belongsTo(() => Application)
  applicationId: number;

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
  email: string;

  @property({
    type: 'string',
    length: 255,
    mysql: {
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

export class PartialApplicationuser {
  constructor(partialAppUser: Partial<Applicationuser>) {
    return {...partialAppUser};
  }
}
