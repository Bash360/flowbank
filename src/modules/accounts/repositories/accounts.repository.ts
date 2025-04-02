import AccountModel, { Account } from '../models/accounts.model';
import BaseRepository from '../../../common/base/base.repository';
import { DatabaseService } from '../../../database/database.service';

class AccountsRepository extends BaseRepository<Account> {
  constructor() {
    super(AccountModel);
  }
}

export default AccountsRepository;
