import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequestHandler } from '@remix-run/express';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';

//const authRoutes = require('./routes/auth');  
//const profileRoutes = require('./routes/profile');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = 'mongodb+srv://mekhareju:user123@cluster0.gakd5.mongodb.net/giftShopDB?retryWrites=true&w=majority';
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Custom API routes
app.use('/routes/auth', authRoutes);
app.use('/routes/profile', profileRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/auth') || req.path.startsWith('/profile')) {
    return res.status(404).json({ message: 'Resource not found' });
  }
  next();
});

app.all('*', (req, res) => {
  createRequestHandler({
    build: require('./build/index.js'),
  })(req, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

