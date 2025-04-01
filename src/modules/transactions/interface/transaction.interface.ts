import TransactionDto from '../dtos/transactions.dto';
import { Transaction } from '../models/transactions.model';
import TransactionType from '../types/transaction.enum';

export default interface ITransaction {
  withdrawal(transactionDto: TransactionDto): Promise<Transaction>;
  transfer(
    transactionDto: TransactionDto,
    transactionType: TransactionType
  ): Promise<Transaction>;
  deposit(
    transactionDto: TransactionDto,
    transactionType: TransactionType
  ): Promise<Transaction>;
}
