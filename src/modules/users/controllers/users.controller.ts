import { GET, route } from 'awilix-express';
import { Request, Response } from 'express';
import { StandardResponse } from '../../../common/response';
import UsersService from '../services/users.service';

@route('/users')
export default class UsersController {
  usersService: UsersService;
  utils: any;
  constructor({
    usersService,
    utils,
  }: {
    usersService: UsersService;
    utils: any;
  }) {
    this.usersService = usersService;
    this.utils = utils;
  }

  @GET()
  public async getUsers(req: Request, res: Response) {
    try {
      const id = 'hhfdhfdh';
      if (!this.utils.isValidObjectId(id)) {
        throw new Error('invalid Id');
      }
      const users = await this.usersService.getUsers(id);
      res.json(users);
    } catch (error) {
      return res.json(new StandardResponse(400, error.message));
    }
  }
}
