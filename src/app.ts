import cors from 'cors';
import express from 'express';

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

export default app;
