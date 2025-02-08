import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success?: boolean;
  message: string;
  data?: T;
};

const ApiResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success || true,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
  });
};

export default ApiResponse;
