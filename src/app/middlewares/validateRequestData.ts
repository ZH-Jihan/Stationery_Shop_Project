import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import asyncHandler from '../utils/asyncHandler';

const validateRequestData = (schema: AnyZodObject) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await schema.parseAsync(req.body, req.cookies);
    },
  );
};

export default validateRequestData;
