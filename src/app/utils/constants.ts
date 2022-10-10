import { environment } from '../../environments/environment';

export const API_ENDPOINT = !environment.production
  ? 'http://localhost:5000/api'
  : 'https://invoice-app-api-production.up.railway.app/api';
