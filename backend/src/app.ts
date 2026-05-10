import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT);
