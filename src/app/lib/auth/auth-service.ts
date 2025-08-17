import { PermissionService } from "./permissions";
import { Role, Permission } from "../../data/types/permissions";
import { AuthResponse, AuthUser, LoginRequest, RefreshTokenRequest } from "@/app/data/types/auth";
import apiClient, { ApiResponse } from "../api/axios-config";


export class AuthService {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_KEY = 'authUser';
  private static readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const loginData: LoginRequest = { email, password };
      
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/api/account/auth/admin-signin',
        loginData
      );

      const authData = response.data.data;
      console.log('Login response:', authData);

      if (!authData.accessToken || !authData.user) {
        throw new Error('Invalid login response - missing required data');
      }

      // Store auth data
      this.setToken(authData.accessToken);
      this.setRefreshToken(authData.refreshToken || '');
      this.setTokenExpiry(authData.expiration || '');
      this.setUser(authData.user);

      // Set user permissions
      PermissionService.setUserPermissions({
        role: authData.user.roles[0] as Role,
        permissions: authData.user.permissions,
      });

      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }
    PermissionService.clearPermissions();
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  static setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  static getTokenExpiry(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    }
    return null;
  }

  static setTokenExpiry(expiry: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry);
    }
  }

  static isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    
    return new Date(expiry) <= new Date();
  }

  static getUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  static setUser(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const refreshData: RefreshTokenRequest = { refreshToken };
      
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/api/auth/refresh',
        refreshData
      );

      const authData = response.data.data;
      if (authData.accessToken) {
        this.setToken(authData.accessToken);
        this.setRefreshToken(authData.refreshToken || '');
        this.setTokenExpiry(authData.expiration || '');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    }
  }

  static async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await apiClient.post<ApiResponse<{ valid: boolean }>>(
        '/api/auth/validate'
      );

      return response.data.data.valid;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  static async initializeAuth(): Promise<AuthUser | null> {
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) {
      return null;
    }

    // For mock authentication, skip token validation
    // In production, uncomment the validation below
    // const isValid = await this.validateToken();
    // if (!isValid) {
    //   this.logout();
    //   return null;
    // }

    PermissionService.setUserPermissions({
      role: user.roles[0] as Role,
      permissions: user.permissions
    });

    return user;
  }

  static hasAdminAccess(): boolean {
    const user = this.getUser();
    if (!user) return false;

    return user.roles.some(role =>
      [Role.SUPER_ADMIN, Role.ADMIN, Role.MODERATOR].includes(role as Role)
    );
  }
}