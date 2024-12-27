const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authMiddleware');
const pool = require('../config/db');

const router = express.Router();


router.get("/getallvendors", authenticateToken, async (req, res) => {

    query= "SELECT * FROM users WHERE role = 'VENDOR'"

    try {
        if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN" && req.user.role !== "HOST") {
            return res.status(403).json({ message: "access denied" })
        }

        const vendorCheck = await pool.query(query)


        res.status(201).json({ message: "All vendors fetched successfully", data: vendorCheck.rows })

    }
    catch(err) {

        console.error(err.message);

        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get("/getallhosts", authenticateToken, async (req, res) => {

    query= "SELECT * FROM users WHERE role = 'HOST'"

    try {
        if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
            return res.status(403).json({ message: "access denied" })
        }

        const vendorCheck = await pool.query(query)


        res.status(201).json({ message: "All vendors fetched successfully", data: vendorCheck.rows })

    }
    catch(err) {

        console.error(err.message);

        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get("/getalladmins", authenticateToken, async (req, res) => {

    query= "SELECT * FROM users WHERE role = 'ADMIN'"

    try {
        if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
            return res.status(403).json({ message: "access denied" })
        }

        const vendorCheck = await pool.query(query)


        res.status(201).json({ message: "All vendors fetched successfully", data: vendorCheck.rows })

    }
    catch(err) {

        console.error(err.message);

        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params; // Extract id from the route parameters
    const query = "SELECT * FROM users WHERE id = $1";

    try {
        // Execute the query with the provided id
        const userResult = await pool.query(query, [id]);

        // If no user is found, return a 404 response
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the fetched user data
        res.status(200).json({ message: "User fetched successfully", data: userResult.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post('/fetchFullName', async (req, res) => {
    const { id } = req.body;
  
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }
  
    try {
      // Query the database for the full name
      const result = await pool.query('SELECT full_name FROM users WHERE id = $1', [id]);
  
      if (result.rows.length > 0) {
        res.status(200).json({ fullName: result.rows[0].full_name });
      } else {
        res.status(404).json({ message: 'User ID not found' });
      }
    } catch (error) {
      console.error('Error fetching full name:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  






module.exports = router;