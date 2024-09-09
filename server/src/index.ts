// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/users'; 
import adminRoutes from './routes/admin';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/admin', adminRoutes);
app.use('/', express.static(path.join(__dirname, 'uploads/')));

const PORT = 3000;

app.get('/', (_,res) => res.send('OK'))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
