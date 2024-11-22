const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Example route that might trigger a validation error
app.post('/api/product', (req, res, next) => {
  const { price } = req.body;

  if (price < 0) {
    // Create a validation error
    const error = new Error('Price must be a positive number');
    error.name = 'ValidationError';
    error.errors = {
      price: {
        message: 'Price must be a positive number',
        name: 'ValidatorError',
        properties: {
          message: 'Price must be a positive number',
          type: 'min',
          min: 0
        },
        kind: 'min',
        path: 'price',
        value: price
      }
    };
    return next(error); // Pass the error to the error handler
  }

  res.send({ message: 'Product created successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the stack trace for development (optional)

  const errorResponse = {
    message: err.message || 'An unexpected error occurred',
    success: false,
    error: {
      name: err.name || 'UnknownError',
      errors: err.errors || {}
    },
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Include stack trace only in development
  };

  res.status(400).json(errorResponse); // Return the error response with status code 400 (Bad Request)
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
