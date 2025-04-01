import mongoose from 'mongoose';
import TransactionType from '../types/transaction.enum';

export default class TransactionDto {
  debitAccountId: mongoose.Types.ObjectId;
  creditAccountId: mongoose.Types.ObjectId;
  amount: number;
}
