const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware')


router.post('/createEvent', authenticateToken, async (req, res) => {

  const {
    company_id,
    admin_id,
    title,
    description,
    category,
    hosts,
    requirements,
    start_date,
    end_date,
    total_budget,
    vendors
  } = req.body;

  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied. Only Admins & SUPERADMIN can create events.' });
    }

    const newEvent = await pool.query(
      `INSERT INTO events (
              company_id, admin_id, title, description, category, hosts, requirements,
              start_date, end_date, total_budget,vendors
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) RETURNING *`,
      [
        company_id, admin_id, title, description, category, hosts,
        JSON.stringify(requirements, null, 2), start_date, end_date, total_budget, vendors
      ]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/', authenticateToken, async (req, res) => {
  const { id } = req.query;

  try {
    let events;

    // Fetch all events if no ID is provided
    events = await pool.query('SELECT * FROM events');
    
    res.status(200).json(events.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const event = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied. Only Admins can update events.' });
    }

    const updatedEvent = await pool.query(
      `UPDATE events SET title = $1, description = $2, status = $3 
         WHERE id = $4 RETURNING *`,
      [title, description, status, id]
    );

    if (updatedEvent.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Check user role
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied. Only Admins can delete events.' });
    }

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Delete vendor assignments related to the event
      const deletedAssignments = await client.query(
        'DELETE FROM vendor_assignments WHERE event_id = $1 RETURNING *',
        [id]
      );

      // Delete the event
      const deletedEvent = await client.query(
        'DELETE FROM events WHERE id = $1 RETURNING *',
        [id]
      );

      if (deletedEvent.rows.length === 0) {
        // Rollback transaction if event is not found
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Event not found' });
      }

      // Commit the transaction
      await client.query('COMMIT');

      res.status(200).json({
        message: 'Event and related vendor assignments deleted successfully',
        deletedEvent: deletedEvent.rows[0],
        deletedAssignments: deletedAssignments.rows,
      });
    } catch (err) {
      // Rollback transaction in case of an error
      await client.query('ROLLBACK');
      console.error('Transaction error:', err.message);
      res.status(500).json({ error: 'Internal server error during transaction' });
    } finally {
      client.release(); // Release the connection
    }
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/hostEvents', authenticateToken, async (req, res) => {
  const { host_id } = req.body; // Get host_id from query params
  try {
    // Check if the user is a HOST
    if (req.user.role === 'VENDOR') {
      return res.status(403).json({ error: 'Access denied. Only Hosts can access their events.' });
    }

    if (!host_id) {
      return res.status(400).json({ error: 'Host ID is required' });
    }

    // Validate UUID format
    if (!/^[0-9a-fA-F-]{36}$/.test(host_id)) {
      return res.status(400).json({ error: 'Invalid host ID format' });
    }

    // Query to find events where the host_id is present in the hosts array
    const events = await pool.query(
      `SELECT * FROM events WHERE $1 = ANY(hosts)`,
      [host_id]
    );

    if (events.rows.length === 0) {
      return res.status(404).json({ message: 'No events found for this host.' });
    }

    res.status(200).json({
      message: 'Events fetched successfully',
      events: events.rows,
    });
  } catch (err) {
    console.error('Error fetching events for host:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;

