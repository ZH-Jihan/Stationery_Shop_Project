import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routers';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// When server starts and hit root path
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Stationery Shop');
});

// Apply router middleware to all routes under '/api'
app.use('/api', router);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
