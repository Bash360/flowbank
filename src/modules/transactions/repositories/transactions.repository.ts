import { Logger } from 'winston';
import BaseRepository from '../../../common/base/base.repository';
import { DatabaseService } from '../../../database/database.service';
import AccountsRepository from '../../accounts/repositories/accounts.repository';
import TransactionDto from '../dtos/transactions.dto';
import TransactionModel, { Transaction } from '../models/transactions.model';
import TransactionType from '../types/transaction.enum';

class TransactionsRepository extends BaseRepository<Transaction> {
  private accountsRepository: AccountsRepository;
  private logger: Logger;
  constructor(
    dbService: DatabaseService,
    {
      accountsRepository,
      logger,
    }: { accountsRepository: AccountsRepository; logger: Logger }
  ) {
    super(TransactionModel, dbService);
    this.accountsRepository = accountsRepository;
    this.logger = logger;
  }

  async withdrawal(transactionDto: TransactionDto): Promise<Transaction> {
    const transaction = await this.transfer(
      transactionDto,
      TransactionType.WITHDRAWAL
    );
    return transaction;
  }

  async transfer(
    transactionDto: TransactionDto,
    transactionType: TransactionType
  ): Promise<Transaction> {
    const session = await this.startTransaction();

    try {
      const { creditAccountId, debitAccountId, amount } = transactionDto;
      const creditAccount = await this.accountsRepository.findById(
        creditAccountId,
        session
      );
      const debitAccount = await this.accountsRepository.findById(
        debitAccountId,
        session
      );

      if (!debitAccount || !creditAccount) {
        throw new Error('Invalid Account ids');
      }

      if (debitAccount.currency !== creditAccount.currency) {
        throw new Error(
          'cannot transfer to accounts with different currencies'
        );
      }
      if (debitAccount.balance < amount) {
        throw new Error('Insufficient funds');
      }

      debitAccount.balance -= amount;
      creditAccount.balance += amount;
      await debitAccount.save({ session });
      await creditAccount.save({ session });
      const transaction = await this.create(
        {
          debitAccount: debitAccount.id,
          creditAccount: creditAccount.id,
          amount,
          type: transactionType,
          currency: debitAccount.currency,
        },
        session
      );

      await this.commitTransaction(session);
      return transaction;
    } catch (error) {
      await this.abortTransaction(session);
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async deposit(transactionDto: TransactionDto): Promise<Transaction> {
    const transaction = await this.transfer(
      transactionDto,
      TransactionType.DEPOSIT
    );
    return transaction;
  }
}

export default TransactionsRepository;
