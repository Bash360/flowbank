import { IsEnum, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';
import Currency from '../../accounts/types/currency.enum';

export default abstract class SharedDto {
  @IsNumber()
  @IsPositive()
  @Min(10, { message: 'amount must be at least 10' })
  amount: number;
  @IsEnum(Currency)
  currency: Currency;
  @IsUUID()
  reference: string;
}
