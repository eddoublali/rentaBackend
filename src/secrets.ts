import dotenv from 'dotenv'

// Load environment variables from .env file

dotenv.config({path:'.env'})

export const PORT=process.env.PORT
export const JWT_SECRET=process.env.JWT_SECRET!