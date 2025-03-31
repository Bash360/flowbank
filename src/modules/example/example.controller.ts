import { Request, Response } from 'express'
import ExampleService from './example.service'
import { route, GET } from 'awilix-express'

@route('/example')
export class ExampleController {
  exampleService: ExampleService
  constructor({ exampleService }: { exampleService: ExampleService }) {
    this.exampleService = exampleService
  }

  @GET()
  public async getExample(req: Request, res: Response) {
    const example = await this.exampleService.getExample('bchhcdh')
    res.json(example)
  }
}
