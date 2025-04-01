import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

function validateDto<T>(DtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(DtoClass, req.body);
      const errors = await validate(dtoInstance as object);

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default validateDto;
