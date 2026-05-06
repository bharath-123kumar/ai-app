import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import { initDb } from './services/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);
app.get('/', (req, res) => {
  res.json({ message: 'Dynamic AI Platform API is running', version: '1.0.0' });
});

const start = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

start();
