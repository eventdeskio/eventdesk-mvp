const request = require('supertest');
const express = require('express');
const adminRouter = require('../../routes/admin');
const pool = require('../../config/db'); // Mock the database pool

jest.mock('../../config/db'); // Mock the database

const app = express();
app.use(express.json());
app.use('/admin', adminRouter);

describe('Admin Routes', () => {
  describe('POST /admin/getcompanyid', () => {
    it('should return 200 and company ID if admin_id exists in the database', async () => {
      // Mock database query to return a valid company ID
      pool.query.mockResolvedValue({
        rows: [{ id: 123 }],
      });

      const response = await request(app)
        .post('/admin/getcompanyid')
        .send({ admin_id: 'valid-admin-id' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Company fetched successfully',
        data: 123,
      });

      // Verify query execution
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id FROM companies WHERE $1 = ANY(admin_id)',
        ['valid-admin-id']
      );
    });

    it('should return 404 if admin_id does not exist in the database', async () => {
      // Mock database query to return an empty result
      pool.query.mockResolvedValue({
        rows: [],
      });

      const response = await request(app)
        .post('/admin/getcompanyid')
        .send({ admin_id: 'non-existent-admin-id' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'No company found for the given admin ID',
      });

      // Verify query execution
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id FROM companies WHERE $1 = ANY(admin_id)',
        ['non-existent-admin-id']
      );
    });

    it('should return 500 if a database error occurs', async () => {
      // Mock database query to throw an error
      pool.query.mockRejectedValue(new Error('Database connection error'));

      const response = await request(app)
        .post('/admin/getcompanyid')
        .send({ admin_id: 'admin-id-causing-error' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Internal server error',
      });

      // Verify query execution
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id FROM companies WHERE $1 = ANY(admin_id)',
        ['admin-id-causing-error']
      );
    });
  });
});
