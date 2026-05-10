import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { DB_ADDRESS, PORT } from './config';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/error-handler';
import orderRouter from './routes/orders';
import productRouter from './routes/products';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use((_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorHandler);

mongoose.connect(DB_ADDRESS);

app.listen(PORT);
