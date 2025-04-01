import mongoose from 'mongoose';
import SharedDto from './shared.dto';

export default class TransferDto extends SharedDto {
  creditAccountId: mongoose.Types.ObjectId;
}
