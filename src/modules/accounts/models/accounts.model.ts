import mongoose, { model, Schema } from 'mongoose';
import Currency from '../types/currency.enum';
import BaseModel, { applyBaseSchema } from '../../../common/base/base.model';

export interface Account extends BaseModel {
  balance: number;
  currency: Currency;
  user: mongoose.Types.ObjectId;
  transactions: mongoose.Types.ObjectId[];
}

const AccountSchema = new Schema<Account>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, enum: Currency },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  },
  { timestamps: true }
);

applyBaseSchema(AccountSchema);

const AccountModel = model<Account>('Account', AccountSchema);

export default AccountModel;
