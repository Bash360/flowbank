import mongoose from 'mongoose';
import { Logger } from 'winston';
import AppError from '../../../common/base/app-error';
import IAccount from '../interface/account.interface';
import { Account } from '../models/accounts.model';
import AccountsRepository from '../repositories/accounts.repository';
import Currency from '../types/currency.enum';

export default class AccountsService implements IAccount {
  private accountsRepository: AccountsRepository;
  private logger: Logger;
  constructor({
    accountsRepository,
    logger,
  }: {
    accountsRepository: AccountsRepository;
    logger: Logger;
  }) {
    this.accountsRepository = accountsRepository;
    this.logger = logger;
  }
  async createAccount(
    userId: mongoose.Types.ObjectId,
    currency: Currency
  ): Promise<Account> {
    const existingAccount = await this.accountsRepository.findOneByFields({
      user: userId,
      currency,
    });

    if (existingAccount) {
      throw new AppError(
        'Can not have multiple accounts of the same currency',
        400
      );
    }
    const account = await this.accountsRepository.create({
      user: userId,
      currency,
    });
    return account;
  }
  async getAccount(accountId: mongoose.Types.ObjectId): Promise<Account> {
    const account = await this.accountsRepository.findById(accountId);
    return account;
  }
  async getAccounts(userId: mongoose.Types.ObjectId): Promise<Account[]> {
    const accounts = await this.accountsRepository.findByAll('user', userId);
    return accounts;
  }
}
