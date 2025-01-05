const request = require('supertest');
const express = require('express');
const pool = require('../../config/db');
const superadminRouter = require('../../routes/superAdmin');
const authenticateToken = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
jest.mock('../../config/db');
jest.mock('../../middleware/authMiddleware');
const secretKey = 'your_secret_key'; // Use the same secret key as in your application
const mockToken = jwt.sign({ id: 1, role: 'SUPER_ADMIN' }, secretKey);

const app = express();
app.use(express.json());
app.use('/sadmin', superadminRouter);

const mockUser = (role) => {
  authenticateToken.mockImplementation((req, res, next) => {
    req.user = { id: 1, role };
    next();
  });
};

// Test for GET /getallcompany
describe('GET /getallcompany', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all companies when role is SUPER_ADMIN', async () => {
    mockUser('SUPER_ADMIN');
    const mockCompanies = [{ id: 1, name: 'Company 1' }, { id: 2, name: 'Company 2' }];
    pool.query.mockResolvedValueOnce({ rows: mockCompanies });

    const res = await request(app)
      .get('/sadmin/getallcompany') 
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('All vendors fetched successfully');
    expect(res.body.data).toEqual(mockCompanies);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM companies');
  });

  it('should return 403 for non-SUPER_ADMIN role', async () => {
    mockUser('ADMIN');

    const res = await request(app)
      .get('/sadmin/getallcompany')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('access denied');
  });

  it('should handle server errors', async () => {
    mockUser('SUPER_ADMIN');
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const res = await request(app)
      .get('/sadmin/getallcompany')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });

  

})

describe('PUT /update-admin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update admin ID for a company', async () => {
    const mockCompany = { company_name: 'Company 1', admin_id: [1, 2] };
    pool.query.mockResolvedValueOnce({ rows: [mockCompany] }); 
    pool.query.mockResolvedValueOnce(); 
    mockUser('SUPER_ADMIN');

    const res = await request(app)
      .put('/sadmin/update-admin')
      .send({ company_name: 'Company 1', new_admin_id: 3 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Admin ID updated successfully');
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM companies WHERE company_name = $1',
      ['Company 1']
    );
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE companies SET admin_id = $1 WHERE company_name = $2',
      [[1, 2, 3], 'Company 1']
    );
  });

  it('should return 404 if the company is not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // No company found
    mockUser('SUPER_ADMIN');

    const res = await request(app)
      .put('/sadmin/update-admin')
      .send({ company_name: 'Nonexistent Company', new_admin_id: 3 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Company not found');
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM companies WHERE company_name = $1',
      ['Nonexistent Company']
    );
  });

  it('should handle server errors gracefully', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error')); 
    mockUser('SUPER_ADMIN');

    const res = await request(app)
      .put('/sadmin/update-admin')
      .send({ company_name: 'Company 1', new_admin_id: 3 });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error updating admin_id');
    expect(res.body.error).toBe('Database error');
  });
});