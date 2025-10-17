// Authentication related types

export interface LoginCredentials {
  client_id: string;
  username: string;
  password: string;
}

export interface RegisterClientData {
  client_name: string;
  username: string;
  password: string;
}

export interface RegisterUserData {
  client_id: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  client_id: string;
  user_id: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthState {
  token: string | null;
  clientId: string | null;
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  registerClient: (data: RegisterClientData) => Promise<void>;
  initAuth: () => void;
}
