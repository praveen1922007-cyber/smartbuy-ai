import api from '../api/axios';

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export async function login(credentials: AuthCredentials) {
  const response = await api.post('/auth/login', {
    email: credentials.email,
    password: credentials.password
  });
  return response.data;
}

export async function register(credentials: AuthCredentials) {
  const response = await api.post('/auth/register', {
    email: credentials.email,
    password: credentials.password,
    name: credentials.name
  });
  return response.data;
}
