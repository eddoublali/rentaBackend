import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
export const DATABASE_URL = process.env.DATABASE_URL;

// Validate required environment variables
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}