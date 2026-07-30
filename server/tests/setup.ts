process.env.NODE_ENV = 'test';
process.env.PORT = '4001';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/car_dealership_test?schema=public';
process.env.JWT_SECRET = 'test-only-secret-that-is-at-least-thirty-two-characters-long';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CORS_ORIGIN = 'http://localhost:5173';
