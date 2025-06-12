"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, message, error, stack, success) {
        super(message); // Initialize the Error base class
        this.statusCode = statusCode;
        this.success = success || false;
        this.error = error;
        // Capture the stack trace (optional but recommended)
        if (stack) {
            this.stack = stack; // Use provided stack
        }
        else {
            // Automatically capture the stack trace (Node.js behavior)
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor); // Omit constructor from stack
            }
        }
        // Optional: Set the error name for better logging
        this.name = 'ApiError';
    }
}
exports.default = ApiError;
