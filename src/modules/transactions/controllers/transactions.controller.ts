import { before, GET, POST, route } from 'awilix-express';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../../common/base/app-error';
import validateDto from '../../../common/middleware/validate-dto';
import Currency from '../../accounts/types/currency.enum';
import authMiddleware from '../../auth/middleware/auth.middleware';
import DepositDto from '../dtos/deposit.dto';
import TransferDto from '../dtos/transfer.dto';
import WithdrawalDto from '../dtos/withdrawal.dto';
import TransactionsService from '../services/transactions.service';

@route('/transactions')
export default class TransactionsController {
  private transactionsService: TransactionsService;
  constructor({
    transactionsService,
  }: {
    transactionsService: TransactionsService;
  }) {
    this.transactionsService = transactionsService;
  }

  @POST()
  @route('/withdrawal')
  @before([authMiddleware, validateDto(WithdrawalDto)])
  async withdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req['user'];
      const { currency, reference, amount } = req.body;
      return res.status(200).json(
        await this.transactionsService.withdrawal(id, {
          currency,
          reference,
          amount,
        })
      );
    } catch (error) {
      next(error);
    }
  }
  @POST()
  @route('/transfer')
  @before([authMiddleware, validateDto(TransferDto)])
  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req['user'];
      const { creditAccountId, currency, reference, amount } = req.body;
      return res.status(200).json(
        await this.transactionsService.transfer(id, {
          creditAccountId,
          currency,
          reference,
          amount,
        })
      );
    } catch (error) {
      next(error);
    }
  }
  @POST()
  @route('/deposit')
  @before([authMiddleware, validateDto(DepositDto)])
  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req['user'];
      const { currency, reference, amount } = req.body;
      return res.status(200).json(
        await this.transactionsService.deposit(id, {
          currency,
          reference,
          amount,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  @GET()
  @before([authMiddleware])
  async transactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { currency } = req.query;
      if (!currency) {
        throw new AppError('currency not in query', 400);
      }
      const { id } = req['user'];

      return res
        .status(200)
        .json(
          await this.transactionsService.getTransactions(
            id,
            currency as Currency
          )
        );
    } catch (error) {
      next(error);
    }
  }
}
