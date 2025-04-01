import { Logger } from 'winston';
import AppError from '../../../common/base/app-error';
import TransactionDto from '../dtos/transactions.dto';
import ITransaction from '../interface/transaction.interface';
import { Transaction } from '../models/transactions.model';
import TransactionsRepository from '../repositories/transactions.repository';
import TransactionType from '../types/transaction.enum';

export default class TransactionsService implements ITransaction {
  private config: any;
  private transactionsRepository: TransactionsRepository;
  private logger: Logger;
  private utils: any;

  constructor({
    config,
    transactionsRepository,
    logger,
    utils,
  }: {
    config: any;
    transactionsRepository: TransactionsRepository;
    logger: Logger;
    utils: any;
  }) {
    this.config = config;
    this.logger = logger;
    this.transactionsRepository = transactionsRepository;
    this.utils = utils;
  }
  async withdrawal(transactionDto: TransactionDto): Promise<Transaction> {
    const { creditAccountId, debitAccountId } = transactionDto;
    if (
      !this.utils.isValidObjectId(creditAccountId) ||
      !this.utils.isValidObjectId(debitAccountId)
    ) {
      this.logger.error('Invalid ObjectId type');
      throw new AppError('Invalid ObjectId type', 400);
    }
    return this.transactionsRepository.withdrawal();
  }
  transfer(
    transactionDto: TransactionDto,
    transactionType: TransactionType
  ): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
  deposit(
    transactionDto: TransactionDto,
    transactionType: TransactionType
  ): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
}
