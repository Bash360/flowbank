import { GET, route } from 'awilix-express';
import { Request, Response } from 'express';
import { DatabaseService } from '../../../database/database.service';

@route('/')
export default class HomeController {
  private dbService: DatabaseService;
  constructor({ databaseService }: { databaseService: DatabaseService }) {
    this.dbService = databaseService;
  }
  @GET()
  healthCheck(req: Request, res: Response) {
    const dbStatus =
      this.dbService.getConnection().readyState === 1 ? 'OK' : 'Fail';
    return res.json({
      message: 'Application is healthy',
      dbStatus,
      timeStamp: new Date().toISOString(),
    });
  }
}
