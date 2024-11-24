import cors from 'cors';
import express from 'express';
import routes from './app/modules/product/product.router';

const app = express();

app.use(
  cors({
    origin: '*',
    // credentials: true,
  }),
);
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Running Assignment');
});

// app.use(express.urlencoded({ extended: true, limit: '16kb' }));
// app.use(express.static('public'));

app.use('/api/products', routes);

export default app;
