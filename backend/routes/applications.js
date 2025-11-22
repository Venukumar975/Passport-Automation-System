import express from 'express';
import db from '../database/connection.js'; // Importing the SAME connection

const router = express.Router();

// 1. USER DASHBOARD: Get all my applications (Active & History)
// Route: GET /api/applications/my-dashboard
// Input: user_id (In a real app, you'd get this from the token/session)
router.get('/my-dashboard', async (req, res) => {
    const userId = req.session.user?.id || req.query.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: No user logged in" });
    }
    try {
        // Fetch applications for this specific user
        const [rows] = await db.query(
           `SELECT 
                application_id ,
                full_name,
                application_status,
                is_draft,
                submitted_at,
                created_at
            FROM applications
            where user_id = ?
            order by created_at DESC`, 
            [userId]
        );

        res.json(rows);
    }catch(error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

// 2. ADMIN: Approve an application
// Route: POST /api/applications/approve
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
// Fetch ALL applications for the Admin Dashboard
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
            ORDER BY submitted_at DESC
        `;
        
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Admin fetch error:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

// GET /api/applications/admin/view/:id
// Fetch Single Application Details for Verification
router.get('/admin/view/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                application_id, 
                full_name, 
                date_of_birth, 
                permanent_address, 
                application_status, 
                application_type, -- We added this column earlier
                photo_file_path, 
                pdf_file_path,
                email -- We join with users table to get email
            FROM applications 
            JOIN users ON applications.user_id = users.id
            WHERE application_id = ?
        `;
        
        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;