// API Configuration for NFT Intelligence AI
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'  // Your backend URL
  : window.location.origin;

export const API_ENDPOINTS = {
  chat: '/api/chat',
  analyzeWallet: '/api/analyze/wallet',
  marketInsights: '/api/market/insights',
  health: '/health',
  demo: '/demo'
};

export default API_BASE_URL;