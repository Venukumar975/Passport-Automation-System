import express from 'express';
import dotenv from 'dotenv';
import db from './database/connection.js';
import cors from 'cors';
import authRouter from './routes/auth.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route to check DB connection
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
