import { NextFunction, Request, Response } from 'express';
import AppError from '../../../common/base/app-error';
import container from '../../../container';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const logger = container.resolve('logger');
  if (!token) {
    console.log('got here');
    throw new AppError('token must be provided', 403);
  }
  try {
    const authService = container.resolve('authService');
    const decoded = authService.decodeToken(token);
    req.headers['user'] = decoded;
    next();
  } catch (error) {
    logger.error(error);
    throw new AppError('Invalid token', 401);
  }
};

export default authMiddleware;
