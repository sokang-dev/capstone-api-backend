import {Entity, property} from '@loopback/repository';

export abstract class BaseEntity extends Entity {
  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'created_date',
      dataType: 'datetime',
      nullable: 'Y',
    },
  })
  createdDate?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'modified_date',
      dataType: 'datetime',
      nullable: 'Y',
    },
  })
  modifiedDate?: Date;
}
