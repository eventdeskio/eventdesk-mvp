const request = require('supertest');
const express = require('express');
const pool = require('../../config/db');
const eventRouter = require('../../routes/events');
const authenticateToken = require('../../middleware/authMiddleware');

jest.mock('../../config/db');
jest.mock('../../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/event', eventRouter);

const mockUser = (role) => {
  authenticateToken.mockImplementation((req, res, next) => {
    req.user = { id: 1, role };
    next();
  });
};

describe('Event Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /event/createEvent', () => {
    it('should return 403 if user is not an admin', async () => {
      mockUser('USER');

      const response = await request(app).post('/event/createEvent').send({
        company_id: 1,
        admin_id: 1,
        title: 'Event 1',
        description: 'Description',
        category: 'Category',
        hosts: [1, 2],
        requirements: {},
        start_date: '2025-01-01',
        end_date: '2025-01-02',
        total_budget: 1000,
        vendors: [1],
      });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Access denied. Only Admins & SUPERADMIN can create events.' });
    });

    it('should return 201 and create a new event', async () => {
      mockUser('ADMIN');

      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, title: 'Event 1' }],
      });

      const response = await request(app).post('/event/createEvent').send({
        company_id: 1,
        admin_id: 1,
        title: 'Event 1',
        description: 'Description',
        category: 'Category',
        hosts: [1, 2],
        requirements: {},
        start_date: '2025-01-01',
        end_date: '2025-01-02',
        total_budget: 1000,
        vendors: [1],
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Event created successfully',
        event: { id: 1, title: 'Event 1' },
      });
    });

    it('should return 500 on server error', async () => {
      mockUser('ADMIN');

      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).post('/event/createEvent').send({
        company_id: 1,
        admin_id: 1,
        title: 'Event 1',
        description: 'Description',
        category: 'Category',
        hosts: [1, 2],
        requirements: {},
        start_date: '2025-01-01',
        end_date: '2025-01-02',
        total_budget: 1000,
        vendors: [1],
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /event', () => {
    it('should return all events', async () => {
      mockUser('USER');

      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Event 1' }] });

      const response = await request(app).get('/event');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, title: 'Event 1' }]);
    });

    it('should return 500 on server error', async () => {
      mockUser('USER');

      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/event');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
// =========================================================================
  describe('GET /event/:id', () => {
    it('should return the event with the specified ID', async () => {
      mockUser('USER');

      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Event 1' }] });

      const response = await request(app).get('/event/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, title: 'Event 1' });
    });

    it('should return 404 if event is not found', async () => {
      mockUser('USER');

      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/event/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Event not found' });
    });

    it('should return 500 on server error', async () => {
      mockUser('USER');

      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/event/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('PUT /event/:id', () => {
    it('should update the event and return it', async () => {
      mockUser('ADMIN');

      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Updated Event' }] });

      const response = await request(app).put('/event/1').send({
        title: 'Updated Event',
        description: 'Updated Description',
        status: 'Active',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Event updated successfully',
        event: { id: 1, title: 'Updated Event' },
      });
    });

    it('should return 403 if user is not an admin', async () => {
      mockUser('USER');

      const response = await request(app).put('/event/1').send({
        title: 'Updated Event',
        description: 'Updated Description',
        status: 'Active',
      });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Access denied. Only Admins can update events.' });
    });

    it('should return 404 if event is not found', async () => {
      mockUser('ADMIN');

      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).put('/event/1').send({
        title: 'Updated Event',
        description: 'Updated Description',
        status: 'Active',
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Event not found' });
    });

    it('should return 500 on server error', async () => {
      mockUser('ADMIN');

      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).put('/event/1').send({
        title: 'Updated Event',
        description: 'Updated Description',
        status: 'Active',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('DELETE /event/:id', () => {
    it('should delete the event and return a success message', async () => {
        mockUser('ADMIN');
        
        // Mock the database connection and queries
        pool.connect.mockResolvedValueOnce({
            query: jest.fn()
              .mockResolvedValueOnce({ rows: [] })  // Mock vendor assignment deletion (empty array)
              .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test Event' }] })  // Mock event deletion (with event data)
              .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test Event' }] })  // Mock the second query (to handle the actual event deletion properly)
            ,
            release: jest.fn(),  // Mock the release method
          });
        
        // Make the DELETE request
        const response = await request(app).delete('/event/1');
      
        const responseBody = JSON.parse(response.text);

        // Assertions
        expect(response.status).toBe(200);  // Check for successful status
        expect(responseBody).toEqual({
            "message": "Event and related vendor assignments deleted successfully",
            "deletedEvent": { "id": 1, "name": "Test Event" },
            "deletedAssignments": [{ "id": 1, "name": "Test Event" }]
          }
          );
      });
      
      
      
      

    it('should return 403 if user is not an admin', async () => {
      mockUser('USER');

      const response = await request(app).delete('/event/1');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Access denied. Only Admins can delete events.' });
    });

    it('should return 404 if event is not found', async () => {
      mockUser('ADMIN');

      pool.connect.mockResolvedValueOnce({
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [] }) // Delete vendor assignments
          .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test Event' }] })  
          .mockResolvedValueOnce({ rows: [] }) // Delete event

,
        release: jest.fn(),
      });

      const response = await request(app).delete('/event/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Event not found' });
    });

    it('should return 500 on server error', async () => {
      mockUser('ADMIN');

      pool.connect.mockRejectedValueOnce(new Error('Transaction error'));

      const response = await request(app).delete('/event/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /event/hostEvents', () => {
    it('should fetch events successfully for a host', async () => {
      // Mock authentication token as a HOST
      const user = { role: 'HOST' };
      const host_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';  // Valid UUID
      
      // Mock DB query for events
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Event 1' }, { id: 2, name: 'Event 2' }]
      });
  
      // Make the POST request
      const response = await request(app)
        .post('/event/hostEvents')
        .set('Authorization', 'Bearer token') // mock token header
        .send({ host_id });
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Events fetched successfully');
      expect(response.body.events.length).toBe(2);
      expect(response.body.events[0].name).toBe('Event 1');
    });
  
    it('should return 403 if user role is VENDOR', async () => {
        mockUser('VENDOR'); 
        const host_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; 
        const response = await request(app)
          .post('/event/hostEvents')
          .set('Authorization', 'Bearer token') 
          .send({ host_id });
      
        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Access denied. Only Hosts can access their events.');
      });
      
  
    it('should return 400 if host_id is missing', async () => {
      
      mockUser('HOST'); 
  
      const response = await request(app)
        .post('/event/hostEvents')
        .set('Authorization', 'Bearer token')
        .send({});
  
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Host ID is required');
    });
  
    it('should return 400 if host_id is in an invalid format', async () => {
    // Invalid UUID format
      mockUser('HOST'); 
      const host_id = 'f47ac4372-a567-0e02b2c3d479'; 
  
      // Make the POST request with invalid host_id
      const response = await request(app)
        .post('/event/hostEvents')
        .set('Authorization', 'Bearer token')
        .send({ host_id });
  
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid host ID format');
    });
  
    it('should return 404 if no events found for the host', async () => {

      const host_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';  
  
      // Mock DB query with no events found
      pool.query.mockResolvedValueOnce({
        rows: []
      });
  
      // Make the POST request
      const response = await request(app)
        .post('/Event/hostEvents')
        .set('Authorization', 'Bearer token')
        .send({ host_id });
  
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No events found for this host.');
    });
  
    it('should return 500 if there is a server error', async () => {
    mockUser('HOST'); 

      const host_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';  
      pool.query.mockRejectedValueOnce(new Error('Database error'));
  
      const response = await request(app)
        .post('/Event/hostEvents')
        .set('Authorization', 'Bearer token')
        .send({ host_id });
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });
});




