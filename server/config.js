// MongoDB Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sentivent';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export {
  MONGO_URI,
  JWT_SECRET
}; 