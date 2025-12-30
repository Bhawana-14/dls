// API Configuration
// Set VITE_API_URL in .env file for production
// Example: VITE_API_URL=http://your-server-ip:8000

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_BASE_URL;


