import mongoose from 'mongoose';

export default class TransactionDto {
  debitAccountId: mongoose.Types.ObjectId;
  creditAccountId: mongoose.Types.ObjectId;
  amount: number;
  reference: string;
}
