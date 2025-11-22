import express from 'express';
import dotenv from 'dotenv';
import db from './database/connection.js';
import cors from 'cors';
import session from 'express-session'; 
import authRouter from './routes/auth.js';
import applicationRouter from './routes/applications.js'; // <--- 1. NEW IMPORT

dotenv.config();
const app = express();

// 2. Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
// 3. Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'replace_this_with_a_long_random_string',
  resave: false,
  saveUninitialized: false,
  rolling: true, 
  cookie: {
    secure: false, 
    httpOnly: true, 
    maxAge: 1000 * 60 * 15 
  }
}));

// Test route
app.get('/testdb', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.json({ message: 'DB connected!', result: rows[0].result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB connection failed', error: err });
    }
});

// Auth routes
app.use('/api/auth', authRouter);

// Application routes
app.use('/api/applications', applicationRouter); // <--- 2. NEW ROUTE

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));