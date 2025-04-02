import mongoose from 'mongoose';
import DepositDto from '../dtos/deposit.dto';
import TransferDto from '../dtos/transfer.dto';
import WithdrawalDto from '../dtos/withdrawal.dto';

export default interface ITransaction {
  withdrawal(
    userId: mongoose.Types.ObjectId,
    withdrawal: WithdrawalDto
  ): Promise<string>;
  transfer(
    userId: mongoose.Types.ObjectId,
    transfer: TransferDto
  ): Promise<string>;
  deposit(
    userId: mongoose.Types.ObjectId,
    deposit: DepositDto
  ): Promise<string>;
}
