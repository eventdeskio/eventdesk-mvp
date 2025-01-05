const request = require('supertest');
const express = require('express');
const router = require('../../routes/vendor'); // Update with the correct path to your vendor.js file
const pool = require('../../config/db');
const authenticateToken = require('../../middleware/authMiddleware');

// Mock database and authenticateToken middleware
jest.mock('../../config/db');
jest.mock('../../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(router);

// Mocking the authenticateToken middleware to bypass actual authentication
authenticateToken.mockImplementation((req, res, next) => {
  req.user = { role: 'ADMIN' }; // Default role set to ADMIN for tests
  next();
});

describe('Vendor Routes', () => {
  describe('GET /', () => {
    it('should fetch all vendor assignments for authorized roles', async () => {
      const mockAssignments = [
        { id: 1, vendor_id: 101, event_id: 201 },
        { id: 2, vendor_id: 102, event_id: 202 },
      ];

      pool.query.mockResolvedValue({ rows: mockAssignments });

      const response = await request(app).get('/');

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Vendor assigned info');
      expect(response.body.event).toEqual(mockAssignments);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM vendor_assignments");
    });

    it('should return 403 for unauthorized roles', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'USER' }; // Mock user with USER role
        next();
      });

      const response = await request(app).get('/');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('access denied');
    });

    it('should return 500 on database error', async () => {

        authenticateToken.mockImplementation((req, res, next) => {
            req.user = { role: 'ADMIN' }; // Mock user with USER role
            next();
          });
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('POST /withid', () => {
    it('should fetch vendor assignments by event ID for authorized roles', async () => {
        
        authenticateToken.mockImplementation((req, res, next) => {
            req.user = { role: 'ADMIN' }; // Mock user with USER role
            next();
          });
      const mockAssignments = [
        { id: 1, vendor_id: 101, event_id: 201 },
      ];

      pool.query.mockResolvedValue({ rows: mockAssignments });

      const response = await request(app)
        .post('/withid')
        .send({ event_id: 201 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Vendor assigned info');
      expect(response.body.event).toEqual(mockAssignments);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM vendor_assignments where event_id= $1",
        [201]
      );
    });

    it('should return 403 for unauthorized roles', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'USER' }; // Mock user with USER role
        next();
      });

      const response = await request(app)
        .post('/withid')
        .send({ event_id: 201 });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('access denied');
    });

    it('should return 400 if event_id is not provided', async () => {
        
        authenticateToken.mockImplementation((req, res, next) => {
            req.user = { role: 'ADMIN' }; // Mock user with USER role
            next();
          });
      const response = await request(app).post('/withid').send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Event id is required');
    });

    it('should return 500 on database error', async () => {
        
        authenticateToken.mockImplementation((req, res, next) => {
            req.user = { role: 'ADMIN' }; // Mock user with USER role
            next();
          });
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/withid')
        .send({ event_id: 201 });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });


  describe('POST /withvendorid', () => {
    it('should fetch vendor assignments by vendor_id for authorized roles', async () => {
      const mockAssignments = [
        { id: 1, vendor: 'Vendor1', assignment: 'Assignment1' },
      ];

      pool.query.mockResolvedValue({ rows: mockAssignments });

      const response = await request(app)
        .post('/withvendorid')
        .send({ host_id: 1 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Vendor assigned info');
      expect(response.body.event).toEqual(mockAssignments);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM vendor_assignments where vendor_id= $1', [1]);
    });

    it('should return 403 for unauthorized roles', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'USER' }; // Mock user with USER role
        next();
      });

      const response = await request(app)
        .post('/withvendorid')
        .send({ host_id: 1 });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('access denied');
    });

    it('should return 500 on database error', async () => {
        authenticateToken.mockImplementation((req, res, next) => {
            req.user = { role: 'ADMIN' }; // Mock user with USER role
            next();
          });
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/withvendorid')
        .send({ host_id: 1 });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });
  describe('POST /assignment', () => {
    it('should add vendor assignments successfully for authorized roles', async () => {
        const mockAssignments = [
          { vendor_id: 101, requirement: "Catering" },
        ];
      
        const mockClient = {
          query: jest.fn(),
          release: jest.fn(),
        };
      
        pool.connect.mockResolvedValue(mockClient);
      
        // Mock the queries
        mockClient.query
          .mockImplementationOnce(() => ({
            rows: [{ vendor_id: 101, event_id: 201, service: "Catering" }], // Simulating an existing assignment
          }))
          .mockImplementationOnce(() => ({ rows: [] })); // Simulate no error during insert query
      
        const response = await request(app)
          .post('/assignment')
          .send({ event_id: 201, assignments: mockAssignments });
      
        // Assertions
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Vendor assignments added successfully');
        expect(mockClient.query).toHaveBeenCalledTimes(4); // Two for `checkQuery` and one for `insertQuery`
       
      });
      
      
  
    it('should return 403 for unauthorized roles', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'USER' }; // Mock user with insufficient role
        next();
      });
  
      const response = await request(app)
        .post('/assignment')
        .send({ event_id: 201, assignments: [] });
  
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied');
    });
  });
  
  describe('POST /updateBudget', () => {
    it('should update the budget successfully', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });
  
      const response = await request(app)
        .post('/updateBudget')
        .send({ event_id: 201, vendor_id: 101, service: "Catering", budget: 5000 });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Budget updated successfully');
      
    });
  });
  
  
});
