import { Permission } from "./permissions";

// ButtonType.ts
export enum ChowmateUsageType {
  VENDOR = "vendor",
  CUSTOMER = "customer",
}

// data/types/auth.ts
export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  deviceId?: string;
  expiration?: string; // ISO string format for DateTime
  user?: AuthUser;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string; // ISO string format for DateTime
  roles: string[];
  permissions: Permission[];
}

// Optional: Helper type for auth state management
export interface AuthState {
  isAuthenticated: boolean;
  user?: AuthUser;
  accessToken?: string;
  refreshToken?: string;
  deviceId?: string;
  expiration?: string;
}

// Optional: Login/Register request types
export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  role?: string;
}

// Optional: Token refresh request
export interface RefreshTokenRequest {
  refreshToken: string;
  deviceId?: string;
}