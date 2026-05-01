// API Configuration
// Update API_BASE_URL when deploying to production

const getApiBase = () => {
  const hostname = window.location.hostname;
  
  // Production (Netlify)
  if (hostname.includes('netlify.app')) {
    return 'https://your-backend-railway-url.up.railway.app';
  }
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://${hostname}:5000`;
  }
  
  // Local network (phone testing)
  return `http://${hostname}:5000`;
};

const API_BASE_URL = getApiBase();

console.log('API Base URL:', API_BASE_URL);