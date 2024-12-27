const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authMiddleware');
const pool = require('../config/db');

const router = express.Router();



router.get("/", authenticateToken, async (req, res) => {

    query = "SELECT * FROM vendor_assignments"

    try {
        if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
            return res.status(403).json({ message: "access denied" })
        }


        const newEvent = await pool.query(query)

        res.status(201).json({ message: "Vendor assigned info", event: newEvent.rows })

    }
    catch(err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post("/withid", authenticateToken, async (req, res) => {

    event_id=req.body.event_id

    query = "SELECT * FROM vendor_assignments where event_id= $1"

    try {
        if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN" && req.user.role !== "VENDOR") {
            return res.status(403).json({ message: "access denied" })
        }


        const newEvent = await pool.query(query,[event_id])

        res.status(201).json({ message: "Vendor assigned info", event: newEvent.rows })

    }
    catch(err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post("/withvendorid", authenticateToken, async (req, res) => {

    host_id=req.body.host_id

    query = "SELECT * FROM vendor_assignments where vendor_id= $1"

    try {
        if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN" && req.user.role !== "VENDOR") {
            return res.status(403).json({ message: "access denied" })
        }


        const newEvent = await pool.query(query,[host_id])

        res.status(201).json({ message: "Vendor assigned info", event: newEvent.rows })

    }
    catch(err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post("/assignment", authenticateToken, async (req, res) => {
    const { event_id, assignments } = req.body; // `assignments` is the array of vendor data
    const insertQuery = `
        INSERT INTO vendor_assignments (event_id, vendor_id, service, budget) 
        VALUES ($1, $2, $3, $4)
    `;
    const checkQuery = `
        SELECT * FROM vendor_assignments 
        WHERE event_id = $1 AND vendor_id = $2 AND service = $3
    `;

    try {
        // Ensure only ADMIN can access
        if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
            return res.status(403).json({ message: "Access denied" });
        }

        const client = await pool.connect(); // Use a connection pool for transaction safety
        try {
            await client.query("BEGIN"); // Start transaction

            // Iterate over the assignments array
            for (const { vendor_id, requirement } of assignments) {
                // Check if the vendor is already assigned to this event with the same service
                const vendorCheck = await client.query(checkQuery, [event_id, vendor_id, requirement]);

                if (vendorCheck.rows.length > 0) {
                    console.log(`Vendor ${vendor_id} already assigned to event ${event_id} for service ${requirement}`);
                    continue; // Skip inserting if already exists with the same service
                }

                // Insert the vendor assignment into the table
                await client.query(insertQuery, [event_id, vendor_id, requirement, null]);
            }

            await client.query("COMMIT"); // Commit transaction
            res.status(201).json({ message: "Vendor assignments added successfully" });
        } catch (err) {
            await client.query("ROLLBACK"); // Rollback on error
            console.error(err.message);
            res.status(500).json({ error: "Error processing assignments" });
        } finally {
            client.release(); // Release the connection
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/updateBudget", authenticateToken, async (req, res) => {
    const { event_id, vendor_id, service, budget } = req.body;

    const updateQuery = `
        UPDATE vendor_assignments 
        SET budget = $1 
        WHERE event_id = $2 AND vendor_id = $3 AND service = $4
    `;

    try {
        await pool.query(updateQuery, [budget, event_id, vendor_id, service]);
        res.status(200).json({ message: "Budget updated successfully" });
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ error: "Failed to update budget" });
    }
});





module.exports = router;