import mongoose, { model, Schema } from 'mongoose';
import BaseModel, { applyBaseSchema } from '../../../common/base/base.model';
import Currency from '../../accounts/types/currency.enum';
import TransactionType from '../types/transaction.enum';

export interface Transaction extends BaseModel {
  type: TransactionType;
  amount: number;
  account: mongoose.Types.ObjectId;
  currency: Currency;
  reference: string;
}

const TransactionSchema = new Schema<Transaction>(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    reference: { type: String, required: true },

    amount: { type: Number, required: true },
    type: { type: String, enum: TransactionType, required: true },
    currency: { type: String, enum: Currency, required: true },
  },
  { timestamps: true }
);

applyBaseSchema(TransactionSchema);

const TransactionModel = model<Transaction>('Transaction', TransactionSchema);

export default TransactionModel;
