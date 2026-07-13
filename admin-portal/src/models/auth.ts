export interface User {
  id: string;
  role: string;
  fullName: string;
  phoneNumber: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user?: User;
}
