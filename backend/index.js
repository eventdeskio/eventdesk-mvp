const express = require('express');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const vendorAssignmentRoutes = require('./routes/vendor')
const allusers = require('./routes/users')
const admin = require('./routes/admin')
const authenticateToken = require('./middleware/authMiddleware');
const pool = require('./config/db'); 
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const app = express();
const superadmin = require('./routes/superAdmin')


const corsOptions = {
    origin: ['http://localhost:4200', 'https://eventdesk.io'], // Allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, 
  };


app.use(cors(corsOptions));


app.use(express.json());

app.use('/api/auth', authRoutes);


app.use('/api/events', eventRoutes);

app.use('/api/vendors', vendorAssignmentRoutes);

app.use('/api/users',allusers)

app.use('/api/admin',admin)

app.use('/api/superadmin',superadmin)

app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.role}!` });
});


app.post('/api/createAdmin', authenticateToken, async (req, res) => {
    
    const { company_name, adminId, company_address, GST_Number, company_email, company_helplline_number } = req.body;

    try {
        // Ensure only SuperAdmin can create an Admin
        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Access denied. Only SuperAdmin can create an Admin.' });
        }

        // Check if the company email already exists
        const companyCheck = await pool.query(
            'SELECT * FROM companies WHERE company_email = $1',
            [company_email]
        );

        if (companyCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Company with this email already exists' });
        }

        // Insert new company into the `companies` table
        const newCompany = await pool.query(
            `INSERT INTO companies (company_name, admin_id, company_address, GST_Number, company_email, company_helplline_number)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, company_name, company_email`,
            [company_name, adminId, company_address, GST_Number, company_email, company_helplline_number]
        );

        res.status(201).json({
            message: 'Admin and company created successfully',
            company: newCompany.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }

});

app.get('/api/getallcompany',async (req, res) => {
    

    try {

        // Check if the company email already exists
        const companyCheck = await pool.query(
            'SELECT company_name FROM companies',
        );

console.log(companyCheck)
        res.status(201).json({
            message: 'Admin names fetched successfully',
            company: companyCheck.rows,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }

})

app.put('/api/update-admin', async (req, res) => {
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



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
