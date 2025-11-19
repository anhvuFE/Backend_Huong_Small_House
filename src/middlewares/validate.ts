import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import AppError from '../utils/appError';

export const validate = (schema: Joi.ObjectSchema) => (req: Request, _res: Response, next: NextFunction): void => {
  const { error } = schema.validate(req.body);

  if (error) {
    throw new AppError(error.message, 422);
  }

  next();
};
