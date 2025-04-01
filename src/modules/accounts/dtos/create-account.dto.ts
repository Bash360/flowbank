import { IsEnum } from 'class-validator';
import Currency from '../types/currency.enum';

export default class CreateAccountDto {
  @IsEnum(Currency)
  currency: Currency;
}
