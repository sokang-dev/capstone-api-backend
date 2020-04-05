import {Entity, property} from '@loopback/repository';

export abstract class TimestampEntity extends Entity {
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
  public modifiedDate?: Date;
}
