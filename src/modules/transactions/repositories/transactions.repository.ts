import BaseRepository from '../../../common/base/base.repository';
import { DatabaseService } from '../../../database/database.service';
import TransactionModel, { Transaction } from '../models/transactions.model';

class TransactionsRepository extends BaseRepository<Transaction> {
  constructor(dbService: DatabaseService) {
    super(TransactionModel, dbService);
  }
}

export default TransactionsRepository;
