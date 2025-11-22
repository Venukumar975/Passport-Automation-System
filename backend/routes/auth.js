import express from 'express';
import db from '../database/connection.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET /api/auth/exists?user=<usernameOrEmail>
router.get('/exists', async (req, res) => {
  const userq = String(req.query.user || '').trim();
  if (!userq){
     return res.status(400).json(
        { 
            ok: false, 
            message: 'missing user' 
        }
    );
  }
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1', [userq, userq]);
    if (!rows || rows.length === 0) {
        return res.json(
          { 
            ok: true,
             exists: false
          }
          );
    }
    const u = rows[0];
    return res.json({ ok: true, exists: true, hasStored: !!(u.password || u.password_hash) });
  } catch (err) {
    console.error('exists error', err);
    return res.status(500).json(
      {
        ok: false,
        message: process.env.NODE_ENV === 'production' ? 'server error' : err.message 
      }
    );
  }
});

// POST /api/auth/login (plaintext comparison only)
router.post('/login',
  body('username').trim().isLength({ min: 1 }).escape(),
  body('password').trim().isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '').trim();

    try {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1', [username, username]);
      if (!rows || rows.length === 0) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

      const user = rows[0];
      // Prefer `password` (plaintext) if present, otherwise use `password_hash` value as-is for plaintext compare
      const stored = user.password || user.password_hash;
      if (!stored) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

      const match = password === String(stored).trim();
      if (!match){
         return res.status(401).json({ ok: false, message: 'Invalid credentials' });
      }

      let role = "user";
      if(user.username === "adminlocalhost" || user.username === "admin123@gmail.com"){
         role = "admin";
      }

      // 4. SAVE SESSION (This is the new part!)
      // This creates the cookie and saves user data on the server
      req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: role
      };

      // 5. Return Response
      return res.status(200).json({
        ok : true,
        user : req.session.user // Send back the same object we stored
      });
    } catch (err) {
      console.error('login error', err);
      return res.status(500).json(
        {
           ok: false,
            message: process.env.NODE_ENV === 'production' ? 'server error' : err.message
        }
        );
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ ok: false, message: 'Logout failed' });
        }
        
        // FIX: Explicitly pass { path: '/' } so the browser finds the exact cookie to delete
        res.clearCookie('connect.sid', { path: '/' }); 
        
        return res.json({ ok: true, message: 'Logged out' });
    });
});
// GET /api/auth/check-session (Use this in React to see if user is still logged in)
router.get('/check-session', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ ok: true, user: req.session.user });
    }
    return res.status(401).json({ ok: false, user: null });
});


// POST /api/auth/register
router.post('/register',
  body('username').trim().isLength({ min: 3 }).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('password').trim().isLength({ min: 4 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim();
    const password = String(req.body.password || '').trim();

    try {
      // check existing user
      const [existing] = await db.query('SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1', [username, email]);
      if (existing && existing.length > 0) return res.status(409).json({ ok: false, message: 'User already exists' });

      // insert — store plaintext in `password` column (existing DB uses plaintext)
      await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);

      return res.status(201).json({ ok: true, message: 'User created' });
    } catch (err) {
      console.error('register error', err);
      return res.status(500).json(
        { 
          ok: false,
           message: process.env.NODE_ENV === 'production' ? 'server error' : err.message
          }
        );
    }
  }
);

export default router;

