const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authMiddleware');
const pool = require('../config/db');

const router = express.Router();


router.post("/getcompanyid", async (req, res) => {
    const query = "SELECT id FROM companies WHERE $1 = ANY(admin_id)";

    try {
        // Fetch company where the admin ID exists in the admin_id array
        const companyResult = await pool.query(query, [req.body.admin_id]);

        if (companyResult.rows.length === 0) {
            return res.status(404).json({ message: "No company found for the given admin ID" });
        }

        const companyId = companyResult.rows[0].id;

        res.status(200).json({ message: "Company fetched successfully", data: companyId });
    } catch (err) {
        console.error("Error fetching company ID:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});






module.exports = router;