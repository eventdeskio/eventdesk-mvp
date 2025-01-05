const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authMiddleware');
const pool = require('../config/db');

const router = express.Router();


router.get('/getallcompany',authenticateToken, async (req, res) => {

  let query = 'SELECT * FROM companies'
  console.log(query)
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "access denied" })
    }

    const companylist = await pool.query(query)

    res.status(201).json({ message: "All vendors fetched successfully", data: companylist.rows })

  }
  catch (err) {

    console.error(err.message);

    res.status(500).json({ error: 'Internal server error' });

  }
});

router.put('/update-admin', async (req, res) => {
  const { company_name, new_admin_id } = req.body;

  try {
    // Step 1: Fetch the company with the specified company_name
    const result = await pool.query(
      'SELECT * FROM companies WHERE company_name = $1',
      [company_name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Step 2: Get the current admin_id array
    const company = result.rows[0];
    let adminIds = company.admin_id || [];

    // Step 3: Append the new_admin_id if it's not already in the array
    if (!adminIds.includes(new_admin_id)) {
      adminIds.push(new_admin_id);
    }

    // Step 4: Update the company record with the new admin_id array
    await pool.query(
      'UPDATE companies SET admin_id = $1 WHERE company_name = $2',
      [adminIds, company_name]
    );

    res.status(200).json({ message: 'Admin ID updated successfully', company });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating admin_id', error: err.message });
  }
});


module.exports = router;

