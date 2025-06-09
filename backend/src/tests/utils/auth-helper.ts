import jwt from 'jsonwebtoken';

export const generateTestToken = () => {
  return jwt.sign(
    { 
      id: 'test-user-id',
      role: 'admin'
    },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};