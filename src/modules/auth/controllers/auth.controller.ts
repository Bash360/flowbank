import { before, POST, route } from 'awilix-express';
import { NextFunction, Request, Response } from 'express';
import validateDto from '../../../common/middleware/validate-dto';
import LoginDto from '../dtos/login.dto';
import SignupDto from '../dtos/signup.dto';
import IAuthService from '../interface/authService.interface';

@route('/auth')
export default class AuthController {
  private authService: IAuthService;
  private utils: any;
  constructor({
    authService,
    utils,
  }: {
    authService: IAuthService;
    utils: any;
  }) {
    this.authService = authService;
    this.utils = utils;
  }

  @POST()
  @route('/login')
  @before([validateDto(LoginDto)])
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token: string = await this.authService.login(email, password);
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
  @POST()
  @route('/signup')
  @before([validateDto(SignupDto)])
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const token: string = await this.authService.register(
        name,
        email,
        password
      );
      return res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  }
}
