import { NextFunction, Request, Response } from 'express';
import container from '../../container';
import AppError from '../base/app-error';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger = container.resolve('logger');
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  logger.error('Unexpected Error:', err);

  return res.status(500).json({
    success: false,
    message: 'Something went wrong, please try again later',
  });
};

export default errorHandler;
