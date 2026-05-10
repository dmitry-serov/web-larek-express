import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { DB_ADDRESS, PORT } from './config';

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(DB_ADDRESS);

app.listen(PORT);
