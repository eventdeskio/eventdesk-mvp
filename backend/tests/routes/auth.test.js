const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const authRouter = require('../../routes/auth');

jest.mock('../../config/db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should return 400 if user already exists', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const response = await request(app).post('/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User',
        role: 'admin',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'User already exists' });
    });

    it('should return 201 and create a new user', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // User does not exist
      bcrypt.hash.mockResolvedValueOnce('hashedpassword');
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'test@example.com', role: 'admin' }],
      });

      const response = await request(app).post('/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User',
        role: 'admin',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'User created successfully',
        user: { id: 1, email: 'test@example.com', role: 'admin' },
      });
    });

    it('should return 500 on server error', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).post('/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User',
        role: 'admin',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /auth/login', () => {
    it('should return 404 if user is not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    it('should return 401 if password does not match', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ email: 'test@example.com', password_hash: 'hashedpassword' }],
      });
      bcrypt.compare.mockResolvedValueOnce(false); // Password does not match

      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Invalid credentials' });
    });

    it('should return 200 and a token if credentials are valid', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'test@example.com', role: 'admin', password_hash: 'hashedpassword' }],
      });
      bcrypt.compare.mockResolvedValueOnce(true); // Password matches
      jwt.sign.mockReturnValueOnce('validtoken');

      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Login successful',
        token: 'validtoken',
      });
    });

    it('should return 500 on server error', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
});
