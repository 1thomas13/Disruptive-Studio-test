import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/users'; 
import contentTypesRoutes from './routes/contentTypes';
import categoriesRoutes from './routes/categories'; 
import contentRoutes from './routes/content';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { getCountsForCategory } from './helpers';
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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



app.use('/api/users', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/contentType', contentTypesRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));
app.get('/', (_,res) => res.send('OK'))

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('requestCounts', async (selectedCategory) => {
    try {
      const counts = await getCountsForCategory(selectedCategory);
      socket.emit('countsUpdate', counts);
    } catch (error) {
      console.error('Error handling requestCounts:', error);
      socket.emit('countsUpdate', { imagesCount: 0, linksCount: 0, filesCount: 0 });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
