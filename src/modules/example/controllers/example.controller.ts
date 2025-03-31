import { Request, Response } from 'express';
import ExampleService from '../services/example.service';
import { route, GET } from 'awilix-express';
import { StandardResponse } from '../../../common/response';

@route('/example')
export default class ExampleController {
  exampleService: ExampleService;
  utils: any;
  constructor({
    exampleService,
    utils,
  }: {
    exampleService: ExampleService;
    utils: any;
  }) {
    this.exampleService = exampleService;
    this.utils = utils;
  }

  @GET()
  public async getExample(req: Request, res: Response) {
    try {
      const id = 'hhfdhfdh';
      if (!this.utils.isValidObjectId(id)) {
        throw new Error('invalid Id');
      }
      const example = await this.exampleService.getExample(id);
      res.json(example);
    } catch (error) {
      return res.json(new StandardResponse(400, error.message));
    }
  }
}
