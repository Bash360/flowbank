import mongoose from 'mongoose';
import { Logger } from 'winston';
import AppError from '../../../common/base/app-error';
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

  constructor({
    config,
    transactionsRepository,
    logger,
    utils,
    accountsRepository,
  }: {
    config: any;
    transactionsRepository: TransactionsRepository;
    logger: Logger;
    utils: any;
    accountsRepository: AccountsRepository;
  }) {
    this.config = config;
    this.logger = logger;
    this.transactionsRepository = transactionsRepository;
    this.utils = utils;
    this.accountsRepository = accountsRepository;
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
    const session = await this.transactionsRepository.startTransaction();

    try {
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

      await this.transactionsRepository.commitTransaction(session);
      return 'Transaction successful';
    } catch (error) {
      await this.transactionsRepository.abortTransaction(session);
      this.logger.error(error);
      throw new AppError(error.message, 400);
    }
  }
}
