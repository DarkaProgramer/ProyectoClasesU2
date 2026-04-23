export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}