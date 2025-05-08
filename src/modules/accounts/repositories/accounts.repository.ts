import BaseRepository from '../../../common/base/base.repository';
import AccountModel, { Account } from '../models/accounts.model';

class AccountsRepository extends BaseRepository<Account> {
  constructor() {
    super(AccountModel);
  }
}

export default AccountsRepository;
