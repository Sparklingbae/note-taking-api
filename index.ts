import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import notesRoutes from './src/routes/notes';
import { ApiError } from './src/utils/ApiError';

const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Note-Taking API!');
});

app.get('/api/notes', async (req, res) => {
  res.json({ message: 'Notes API is working!' });
});

app.use('/api/notes', notesRoutes);


mongoose
  .connect('mongodb+srv://infoblessingasuquo:fidelitybank@note-taking-api.f2isr.mongodb.net/?retryWrites=true&w=majority&appName=note-taking-api')
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