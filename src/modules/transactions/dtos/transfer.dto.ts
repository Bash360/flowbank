import { IsString } from 'class-validator';
import SharedDto from './shared.dto';

export default class TransferDto extends SharedDto {
  @IsString()
  creditAccountId: string;
}
