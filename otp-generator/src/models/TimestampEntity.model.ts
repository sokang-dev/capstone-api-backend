import {Entity, property} from '@loopback/repository';

export abstract class TimestampEntity extends Entity {
  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      dataType: 'datetime',
      nullable: 'Y',
    },
  })
  createdDate?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      dataType: 'datetime',
      nullable: 'Y',
    },
  })
  public modifiedDate?: Date;
}
