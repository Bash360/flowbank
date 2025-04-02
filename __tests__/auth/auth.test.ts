import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthService from '../../src/modules/auth/services/auth.service';

const mockUsersRepository = {
  findBy: jest.fn(),
  create: jest.fn(),
};
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService;
  let usersRepository;
  let config;

  beforeEach(() => {
    usersRepository = mockUsersRepository;
    config = {
      ADMIN_EMAIL: 'admin@domain.com',
      JWT_SECRET: 'secret',
    };
    authService = new AuthService({ usersRepository, config });
  });

  describe('login', () => {
    it('should throw an error if trying to log in with admin email', async () => {
      await expect(
        authService.login(config.ADMIN_EMAIL, 'password')
      ).rejects.toThrow('login not allowed for this user');
    });

    it('should throw an error if user does not exist', async () => {
      usersRepository.findBy = jest.fn().mockResolvedValue(null);

      await expect(
        authService.login('test@gmail.com', 'password')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error if password is incorrect', async () => {
      usersRepository.findBy = jest.fn().mockResolvedValue({
        email: 'test@gmail.com',
        password: 'blahblah',
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(
        authService.login('test@gmail.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should return a token if login is successful', async () => {
      usersRepository.findBy = jest.fn().mockResolvedValue({
        id: '123',
        email: 'test@gmail.com',
        password: 'blahblah',
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue('validToken');

      const token = await authService.login('test@gmail.com', 'password');
      expect(token).toBe('validToken');
    });
  });

  describe('register', () => {
    it('should throw an error if email already exists', async () => {
      usersRepository.findBy = jest
        .fn()
        .mockResolvedValue({ email: 'test@gmail.com' });

      await expect(
        authService.register('User', 'test@gmail.com', 'password')
      ).rejects.toThrow('Can not have duplicate email user already exist');
    });

    it('should return a token on successful registration', async () => {
      usersRepository.findBy = jest.fn().mockResolvedValue(null);
      bcrypt.hash = jest.fn().mockResolvedValue('blahblah');
      usersRepository.create = jest
        .fn()
        .mockResolvedValue({ id: '123', email: 'test@gmail.com' });
      jwt.sign = jest.fn().mockReturnValue('validToken');

      const token = await authService.register(
        'User',
        'test@gmail.com',
        'password'
      );
      expect(token).toBe('validToken');
    });
  });
});
