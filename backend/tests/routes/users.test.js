const request = require('supertest');
const express = require('express');
const router = require('../../routes/users'); // Update with the correct path to your users.js file
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

describe('Users Routes', () => {

  describe('GET /getallvendors', () => {
    it('should fetch all vendors for authorized roles', async () => {
      const mockVendors = [
        { id: 1, name: 'Vendor1', role: 'VENDOR' },
        { id: 2, name: 'Vendor2', role: 'VENDOR' },
      ];

      pool.query.mockResolvedValue({ rows: mockVendors });

      const response = await request(app).get('/getallvendors');

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('All vendors fetched successfully');
      expect(response.body.data).toEqual(mockVendors);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users WHERE role = 'VENDOR'");
    });

    it('should return 403 for unauthorized roles', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'USER' }; // Mock user with USER role
        next();
      });

      const response = await request(app).get('/getallvendors');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('access denied');
    });

    it('should return 500 on database error', async () => {
        authenticateToken.mockImplementation((req, res, next) => {
            req.user = { role: 'ADMIN' }; // Mock user with USER role
            next();
          });
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/getallvendors');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('GET /getallhosts', () => {
    it('should fetch all hosts for authorized roles', async () => {
      const mockHosts = [
        { id: 1, name: 'Host1', role: 'HOST' },
        { id: 2, name: 'Host2', role: 'HOST' },
      ];

      pool.query.mockResolvedValue({ rows: mockHosts });

      const response = await request(app).get('/getallhosts');

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('All vendors fetched successfully');
      expect(response.body.data).toEqual(mockHosts);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users WHERE role = 'HOST'");
    });

    it('should return 403 for unauthorized roles', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'VENDOR' }; // Mock user with VENDOR role
        next();
      });

      const response = await request(app).get('/getallhosts');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('access denied');
    });

    it('should return 500 on database error', async () => {
        authenticateToken.mockImplementation((req, res, next) => {
            req.user = { role: 'ADMIN' }; // Mock user with VENDOR role
            next();
          });
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/getallhosts');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });


  describe('GET /getalladmins', () => {
    it('should fetch all admins for authorized roles', async () => {
      const mockAdmins = [
        { id: 1, name: 'Admin1', role: 'ADMIN' },
        { id: 2, name: 'Admin2', role: 'ADMIN' },
      ];

      pool.query.mockResolvedValue({ rows: mockAdmins });

      const response = await request(app).get('/getalladmins');

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('All vendors fetched successfully');
      expect(response.body.data).toEqual(mockAdmins);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users WHERE role = 'ADMIN'");
    });

    it('should return 403 for unauthorized roles', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'VENDOR' }; // Mock user with VENDOR role
        next();
      });

      const response = await request(app).get('/getalladmins');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('access denied');
    });

    it('should return 500 on database error', async () => {
        authenticateToken.mockImplementation((req, res, next) => {
            req.user = { role: 'ADMIN' };
            next();
          });
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/getalladmins');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });


  describe('GET /:id', () => {
    it('should fetch a user by ID for authorized roles', async () => {
      const mockUser = { id: 1, name: 'User1', role: 'USER' };

      pool.query.mockResolvedValue({ rows: [mockUser] });

      const response = await request(app).get('/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User fetched successfully');
      expect(response.body.data).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", ["1"]);
    });

    it('should return 404 if user not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/99');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 on database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });


  describe('POST /fetchFullName', () => {
    it('should fetch full name for a valid ID', async () => {
      const mockFullName = { full_name: 'John Doe' };

      pool.query.mockResolvedValue({ rows: [mockFullName] });

      const response = await request(app)
        .post('/fetchFullName')
        .send({ id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.fullName).toBe('John Doe');
      expect(pool.query).toHaveBeenCalledWith('SELECT full_name FROM users WHERE id = $1', [1]);
    });

    it('should return 400 if ID is not provided', async () => {
      const response = await request(app).post('/fetchFullName').send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ID is required');
    });

    it('should return 404 if user ID not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/fetchFullName')
        .send({ id: 99 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User ID not found');
    });

    it('should return 500 on database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/fetchFullName')
        .send({ id: 1 });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });
});
