import {
  IsDecimal,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import Currency from '../../accounts/types/currency.enum';

export default abstract class SharedDto {
  @IsNumber()
  @IsDecimal()
  @IsPositive()
  @Min(10, { message: 'amount must be at least 10' })
  amount: number;
  @IsEnum(Currency)
  currency: Currency;
  @IsString()
  reference: string;
}
