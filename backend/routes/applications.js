import express from 'express';
import db from '../database/connection.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// 1. CONFIGURATION: Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        // Ensure this 'uploads' folder exists
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. INITIALIZE MULTER
const upload = multer({ storage: storage });

// 3. CONFIGURE FIELDS
const fileUploadMiddleware = upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'supportingDoc', maxCount: 1 }
]);

// --- ROUTE: Submit Application ---
router.post('/submit', (req, res) => {
    // A. Check Session First
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    // B. Run File Upload Middleware manually
    fileUploadMiddleware(req, res, async (err) => {
        if (err) {
            console.error("Upload Error:", err);
            return res.status(500).json({ error: "File upload failed: " + err.message });
        }

        try {
            const userId = req.session.user.id;
            const { fullName, dob, address, applicationType } = req.body;

            const photoPath = req.files['passportPhoto'] ? req.files['passportPhoto'][0].path : null;
            const docPath = req.files['supportingDoc'] ? req.files['supportingDoc'][0].path : null;

            // --- FIX: Added 'submitted_at' column and 'NOW()' value ---
            const query = `
                INSERT INTO applications 
                (user_id, full_name, date_of_birth, permanent_address, application_type, photo_file_path, pdf_file_path, is_draft, application_status, created_at, submitted_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, 'Pending', NOW(), NOW())
            `;

            await db.query(query, [
                userId,
                fullName,
                dob,
                address,
                applicationType,
                photoPath,
                docPath
            ]);

            res.json({ message: "Application submitted successfully" });

        } catch (dbError) {
            console.error("Database Insert Error:", dbError);
            res.status(500).json({ error: "Database error during submission" });
        }
    });
});

// 1. USER DASHBOARD
router.get('/my-dashboard', async (req, res) => {
    const userId = req.session.user?.id || req.query.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: No user logged in" });
    }
    try {
        const [rows] = await db.query(
            `SELECT 
                application_id, full_name, application_status, is_draft, submitted_at, created_at 
            FROM applications 
            WHERE user_id = ? 
            ORDER BY created_at DESC`, 
            [userId]
        );
        res.json(rows);
    } catch(error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

// 2. ADMIN: Approve an application
router.post('/approve', async (req, res) => {
    const { applicationId } = req.body;

    const today = new Date();
    const expiryDate = new Date(today.setFullYear(today.getFullYear() + 10)); // +10 Years
    const formattedExpiry = expiryDate.toISOString().split('T')[0];

    try {
        await db.query(
            `UPDATE applications 
             SET application_status = 'Approved', expiry_date = ? 
             WHERE application_id = ?`,
            [formattedExpiry, applicationId]
        );
        res.json({ message: "Application Approved Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to approve application" });
    }
});

// GET /api/applications/admin/all-applications
router.get('/admin/all-applications', async (req, res) => {
    try {
        const query = `
            SELECT 
                application_id, 
                full_name, 
                application_type, 
                application_status, 
                submitted_at 
            FROM applications
            WHERE is_draft = false
            ORDER BY submitted_at DESC
        `;
        
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Admin fetch error:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

// 1. GET Single Application Details
router.get('/admin/view/:id', async (req, res) => {
    try {
        const query = `
            SELECT a.*, u.email 
            FROM applications a
            JOIN users u ON a.user_id = u.id
            WHERE a.application_id = ?`;
            
        const [rows] = await db.query(query, [req.params.id]);
        
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// 2. POST Reject Application
router.post('/reject', async (req, res) => {
    const { applicationId, remarks } = req.body;
    try {
        await db.query(
            `UPDATE applications SET application_status = 'Rejected', admin_remarks = ? WHERE application_id = ?`,
            [remarks, applicationId]
        );
        res.json({ message: "Rejected successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to reject" });
    }
});

export default router;