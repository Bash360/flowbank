import BaseRepository from '../../../common/base/base.repository';
import { DatabaseService } from '../../../database/database.service';
import TransactionModel, { Transaction } from '../models/transactions.model';

class TransactionsRepository extends BaseRepository<Transaction> {
  constructor() {
    super(TransactionModel);
  }
}

export default TransactionsRepository;
