import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodIssue } from 'zod';
import { TErrorResponse, TErrorSources } from '../interface/error.interface';

const zodErrorHandler = (error: ZodError): TErrorResponse => {
  const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = StatusCodes.NOT_ACCEPTABLE;
  return {
    message: 'Validation Error. Request not accepted',
    statusCode,
    errorSource: errorSources,
  };
};

export default zodErrorHandler;
