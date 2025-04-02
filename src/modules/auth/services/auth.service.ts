import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../../../common/base/app-error';
import UsersRepository from '../../users/repositories/users.repository';
import IAuthService from '../interface/authService.interface';
import Payload from '../types/payload.type';

export default class AuthService implements IAuthService {
  private usersRepository: UsersRepository;
  private config: any;
  constructor({
    usersRepository,
    config,
  }: {
    usersRepository: UsersRepository;
    config: any;
  }) {
    this.usersRepository = usersRepository;
    this.config = config;
  }
  async login(email: string, password: string): Promise<string> {
    if (email === this.config.ADMIN_EMAIL) {
      throw new AppError('login not allowed for this user', 403);
    }
    const user = await this.usersRepository.findBy('email', email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid email or password', 400);
    }

    return await this.signToken(user['id'], user['email']);
  }
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<string> {
    const user = await this.usersRepository.findBy('email', email);
    if (user)
      throw new AppError(
        'Can not have duplicate email user already exist',
        400
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = await this.signToken(newUser['id'], newUser['email']);

    return token;
  }
  private signToken(id: string, email: string): string {
    const token = jwt.sign({ id, email }, this.config.JWT_SECRET, {
      expiresIn: '2hr',
    });
    return token;
  }

  private decodeToken(token: string): Payload {
    const decode: Payload = jwt.verify(token, this.config.JWT_SECRET);
    return decode;
  }
}
