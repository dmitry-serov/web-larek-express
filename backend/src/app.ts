import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { DB_ADDRESS, PORT } from './config';
import productRouter from './routes/products';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/product', productRouter);

mongoose.connect(DB_ADDRESS);

app.listen(PORT);
