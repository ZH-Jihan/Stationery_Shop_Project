import cors from 'cors';
import express from 'express';
import orderRoutes from './app/modules/order/order.router';
import productRoutes from './app/modules/product/product.router';

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

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

export default app;
