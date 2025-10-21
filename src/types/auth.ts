// Authentication related types

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  client_id: string;
  email: string;
  display_name: string;
  password: string;
}

export interface Client {
  client_id: string;
  name: string;
  website?: string;
  entity_number?: string;
  description?: string;
  created_at: string;
}

export interface AuthState {
  token: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterUserData) => Promise<void>;
  initAuth: () => void;
}
