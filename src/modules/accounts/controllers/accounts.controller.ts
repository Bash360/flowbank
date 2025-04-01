import { before, GET, POST, route } from 'awilix-express';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import validateDto from '../../../common/middleware/validate-dto';
import authMiddleware from '../../auth/middleware/auth.middleware';
import CreateAccountDto from '../dtos/create-account.dto';
import AccountsService from '../services/accounts.service';

@route('/accounts')
export default class AccountsController {
  private accountsService: AccountsService;

  constructor({ accountsService }: { accountsService: AccountsService }) {
    this.accountsService = accountsService;
  }

  @POST()
  @before([authMiddleware, validateDto(CreateAccountDto)])
  async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { currency } = req.body;
      const { id } = req['user'];
      const account = await this.accountsService.createAccount(id, currency);
      return res.status(201).json(account);
    } catch (error) {
      next(error);
    }
  }

  @GET()
  @route('/:id')
  @before([authMiddleware])
  async getAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params['id'] as unknown as mongoose.Types.ObjectId;
      const account = await this.accountsService.getAccount(id);
      res.status(200).json(account);
    } catch (error) {
      next(error);
    }
  }
  @GET()
  @before([authMiddleware])
  async getAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req['user'];
      const accounts = await this.accountsService.getAccounts(id);
      res.status(200).json(accounts);
    } catch (error) {
      next(error);
    }
  }
}
