import mongoose from 'mongoose';
import { Account } from '../models/accounts.model';
import Currency from '../types/currency.enum';

export default interface IAccount {
  createAccount(
    userId: mongoose.Types.ObjectId,
    currency: Currency
  ): Promise<Account>;
  getAccount(accountId: mongoose.Types.ObjectId): Promise<Account>;
  getAccounts(userId: mongoose.Types.ObjectId): Promise<Account[]>;
}
