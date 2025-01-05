const { Pool } = require('pg');  
const pool = require('../../config/db');
jest.mock('pg'); 
describe('Database Connection', () => {
  let mockQuery;
  let mockRelease;

  beforeAll(() => {
    mockQuery = jest.fn().mockResolvedValue({
      rows: [{ id: 1, name: 'Test Event' }]
    });
    mockRelease = jest.fn();

    Pool.prototype.connect = jest.fn().mockResolvedValue({
      query: mockQuery,
      release: mockRelease,
    });

    pool.connect = Pool.prototype.connect;
  });

  it('should establish a database connection', async () => {
    const client = await pool.connect(); 
    expect(client.query).toBeDefined();  
    expect(client.release).toBeDefined();  
  });

  it('should execute a simple query', async () => {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    expect(res.rows).toBeInstanceOf(Array);
    expect(res.rows).toHaveLength(1);
    client.release();
  });
});

