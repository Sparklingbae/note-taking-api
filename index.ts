import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import notesRoutes from './src/routes/notes';
import authRoutes from './src/routes/authRoutes';
import { ApiError } from './src/utils/ApiError';
import { logger } from './src/middleware/logger';

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();


app.use(bodyParser.json());
app.use(logger);


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Note-Taking API!');
});

app.get('/api/notes', async (req, res) => {
  res.json({ message: 'Notes API is working!' });
});

app.use('/api/notes', notesRoutes);
app.use("/api/auth", authRoutes);

const MONGODB_URI = process.env.MONGODB_URI as string;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error(err); 
  res.status(500).json({ message: 'Internal Server Error' });
};


app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});