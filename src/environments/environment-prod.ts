export const environment = {
  production: false,
//   apiUrl: 'http://localhost:8080', 
  apiUrl: process.env['API_URL'] || 'https://certificate-generation-backend-production.up.railway.app'
};