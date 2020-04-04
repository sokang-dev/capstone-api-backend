import {DefaultCrudRepository} from '@loopback/repository';
import {Account, AccountRelations} from '../models';
import {OtpgenDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.id,
  AccountRelations
> {
  constructor(@inject('datasources.OtpgenDb') dataSource: OtpgenDbDataSource) {
    super(Account, dataSource);
  }

  // Update modifiedDate property when model is about to be updated
  definePersistedModel(entityClass: typeof Account) {
    const account = super.definePersistedModel(entityClass);

    account.observe('before save', async ctx => {
      // When it is a full update
      if (ctx.instance) {
        ctx.instance.modifiedDate = new Date();
      }

      // When it is a partial update
      else {
        ctx.data.modifiedDate = new Date();
      }
    });

    return account;
  }
}
