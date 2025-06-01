import mongoose from 'mongoose';
import { Logger } from 'winston';
import AppError from '../../../common/base/app-error';
import { DatabaseService } from '../../../database/database.service';
import AccountsRepository from '../../accounts/repositories/accounts.repository';
import Currency from '../../accounts/types/currency.enum';
import DepositDto from '../dtos/deposit.dto';
import TransactionDto from '../dtos/transactions.dto';
import TransferDto from '../dtos/transfer.dto';
import WithdrawalDto from '../dtos/withdrawal.dto';
import ITransaction from '../interface/transaction.interface';
import { Transaction } from '../models/transactions.model';
import TransactionsRepository from '../repositories/transactions.repository';
import TransactionType from '../types/transaction.enum';

export default class TransactionsService implements ITransaction {
  private config: any;
  private transactionsRepository: TransactionsRepository;
  private logger: Logger;
  private utils: any;
  private accountsRepository: AccountsRepository;
  private dbService: DatabaseService;
  constructor({
    config,
    transactionsRepository,
    logger,
    utils,
    accountsRepository,

    databaseService,
  }: {
    config: any;
    transactionsRepository: TransactionsRepository;
    logger: Logger;
    utils: any;
    accountsRepository: AccountsRepository;
    databaseService: DatabaseService;
  }) {
    this.config = config;
    this.logger = logger;
    this.transactionsRepository = transactionsRepository;
    this.utils = utils;
    this.accountsRepository = accountsRepository;
    this.dbService = databaseService;
  }
  async transfer(
    userId: mongoose.Types.ObjectId,
    transfer: TransferDto
  ): Promise<string> {
    const { currency, amount, reference, creditAccountId } = transfer;
    const userAccount = await this.accountsRepository.findOneByFields({
      user: userId,
      currency,
    });

    return await this.handleTransfer({
      amount,
      creditAccountId,
      debitAccountId: userAccount.id,
      reference,
    });
  }
  async withdrawal(
    userId: mongoose.Types.ObjectId,
    withdrawal: WithdrawalDto
  ): Promise<string> {
    const { currency, amount, reference } = withdrawal;
    const userAccount = await this.accountsRepository.findOneByFields({
      user: userId,
      currency,
    });
    if (userAccount.balance < amount) {
      throw new AppError('insufficient funds for withdrawal', 400);
    }
    const creditAccountId =
      currency === Currency.NGN
        ? this.config['NGN_RESERVE']
        : this.config['USD_RESERVE'];

    return await this.handleTransfer({
      amount,
      creditAccountId,
      debitAccountId: userAccount.id,
      reference,
    });
  }

  async deposit(
    userId: mongoose.Types.ObjectId,
    deposit: DepositDto
  ): Promise<string> {
    const { currency, amount, reference } = deposit;
    const userAccount = await this.accountsRepository.findOneByFields({
      user: userId,
      currency,
    });
    if (!userAccount) {
      throw new AppError(
        `${currency} account type must exist before attempting to deposit in it`,
        400
      );
    }

    const debitAccountId =
      currency === Currency.NGN
        ? this.config['NGN_RESERVE']
        : this.config['USD_RESERVE'];
    return await this.handleTransfer({
      debitAccountId,
      creditAccountId: userAccount.id,
      amount,
      reference,
    });
  }

  async getTransactions(
    userId: mongoose.Types.ObjectId,
    currency: Currency
  ): Promise<Transaction[]> {
    const userAccount = await this.accountsRepository.findOneByFields({
      user: userId,
      currency,
    });
    if (!userAccount) {
      throw new AppError(`No ${currency} account found for this user`, 404);
    }
    const transactions = this.transactionsRepository.findByFields({
      account: userAccount.id,
    });
    return transactions;
  }

  private async handleTransfer(
    transactionDto: TransactionDto
  ): Promise<string> {
    const { creditAccountId, debitAccountId, amount, reference } =
      transactionDto;
    const referenceExists = await this.transactionsRepository.findBy(
      'reference',
      reference
    );
    if (referenceExists) {
      throw new AppError('reference must be unique', 400);
    }

    const session = await this.dbService.getConnection().startSession();

    try {
      session.startTransaction();
      const creditAccount = await this.accountsRepository.findById(
        new mongoose.Types.ObjectId(creditAccountId),
        session
      );
      const debitAccount = await this.accountsRepository.findById(
        new mongoose.Types.ObjectId(debitAccountId),
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
      await this.transactionsRepository.create(
        {
          account: debitAccount.id,
          amount,
          type: TransactionType.DEBIT,
          currency: debitAccount.currency,
          reference,
        },
        session
      );

      await this.transactionsRepository.create(
        {
          account: creditAccount.id,
          amount,
          type: TransactionType.CREDIT,
          currency: debitAccount.currency,
          reference,
        },
        session
      );

      await session.commitTransaction();
      session.endSession();
      return 'Transaction successful';
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      this.logger.error(error);
      throw new AppError(error.message, 400);
    }
  }
}
