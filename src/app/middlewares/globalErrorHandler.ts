import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import zodErrorHandler from '../errors/zodError';
import { TErrorSources } from '../interface/error.interface';
import ApiError from '../utils/ApiError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);

  let statusCode = StatusCodes.BAD_REQUEST;
  let message = 'Something went wrong';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (error instanceof ZodError) {
    const errorReponse = zodErrorHandler(error);
    statusCode = errorReponse?.statusCode;
    message = errorReponse?.message;
    errorSources = errorReponse?.errorSource;
  }
  if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorSources = [
      {
        path: 'Read Error Messages',
        message: error?.message,
      },
    ];
  }
  if (error instanceof Error) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = error?.message;
    errorSources = [
      {
        path: 'Read Error Messages',
        message: error?.message,
      },
    ];
  }
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorSources,
    stack: error.stack,
  });
};

export default globalErrorHandler;
