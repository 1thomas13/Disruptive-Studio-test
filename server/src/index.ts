// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/users'; 

dotenv.config();

const app = express();

const mongoDB = process.env.MONGODB_URI;

if (!mongoDB) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(mongoDB)
  .then(() => {
    console.log('Connected to MongoDB database');
  })
  .catch((error) => {
    console.error('Connection error:', error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/users', authRoutes);

const PORT = 3000;

app.get('/', (_,res) => res.send('OK'))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
