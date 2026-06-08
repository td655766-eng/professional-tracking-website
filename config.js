// API Configuration
// Update API_BASE_URL when deploying to production

const getApiBase = () => {
  const hostname = window.location.hostname || 'localhost';
  
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

window.API_BASE_URL = API_BASE_URL;
window.FIREBASE_CONFIG = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://REPLACE_WITH_YOUR_PROJECT.firebaseio.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.appspot.com",
  messagingSenderId: "",
  appId: ""
};

console.log('API Base URL:', API_BASE_URL);
