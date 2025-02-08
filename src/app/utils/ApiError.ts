interface ErrorResponse {
  message: string;
  statusCode: number;
  success?: boolean;
  error?: any;
  stack?: string;
}

class ApiError extends Error {
  // Extend the built-in Error class
  success: boolean;
  error: any;
  statusCode: number;

  constructor(
    statusCode: number,
    message: string,
    error?: any,
    stack?: string,
    success?: boolean,
  ) {
    super(message); // Initialize the Error base class
    this.statusCode = statusCode;
    this.success = success || false;
    this.error = error;

    // Capture the stack trace (optional but recommended)
    if (stack) {
      this.stack = stack; // Use provided stack
    } else {
      // Automatically capture the stack trace (Node.js behavior)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor); // Omit constructor from stack
      }
    }

    // Optional: Set the error name for better logging
    this.name = 'ApiError';
  }
}

export default ApiError;
