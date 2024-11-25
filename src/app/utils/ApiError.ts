interface ErrorResponse {
  message: string;
  success: boolean;
  error: any;
  stack?: string;
}
class ApiError {
  message: string;
  success: boolean;
  error: any;
  stack?: string;

  constructor(message: string, success: boolean, error: any, stack?: string) {
    this.message = message;
    this.success = success;
    this.error = error;
    this.stack = stack;
  }
}

export default ApiError;
