// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/users'; 
import adminRoutes from './routes/admin';
import cors from 'cors';
import path from 'path';
import { Category, Content } from './models';

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
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.use('/api/users', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = 3000;

app.get('/api/admin/contents/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('category', 'name imageUrl')
      .populate('creator', 'username');

    if (!content) return res.status(404).json({ message: 'Content not found' });

    res.status(200).json(content);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
})

app.get('/api/contents', async (req, res) => {
  try {
    const contents = await Content.find()
      .populate({
        path: 'category',
        select: 'name imageUrl'
      })
      .populate({
        path: 'creator',
        select: 'username'
      })
      .select('name category creator');

    res.status(200).json(contents);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/api/categories', async (_, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (_,res) => res.send('OK'))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
