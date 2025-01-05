const jwt = require('jsonwebtoken');
const { generateToken } = require('../../config/jwt');

jest.mock('jsonwebtoken');

describe('generateToken', () => {
    it('should generate a JWT token with the correct payload and options', () => {
        const user = { id: 1, role: 'admin' };
        const token = 'mock-token';

        // Mock the jwt.sign method to return a mock token
        jwt.sign.mockReturnValue(token);

        const result = generateToken(user);

        // Verify that jwt.sign was called with the correct arguments
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Verify that the returned token is the mock token
        expect(result).toBe(token);
    });
});
