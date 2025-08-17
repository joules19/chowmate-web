import { PermissionService } from "./permissions";
import { UserPermissions, Role, Permission } from "../../data/types/permissions";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: Permission[];
}

export class AuthService {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly USER_KEY = 'authUser';

  static async login(email: string, password: string): Promise<AuthUser> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      if (data.success) {
        this.setToken(data.token);
        this.setUser(data.user);
        
        PermissionService.setUserPermissions({
          role: data.user.roles[0] as Role,
          permissions: data.user.permissions
        });

        return data.user;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
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
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          this.setToken(data.token);
          return true;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    this.logout();
    return false;
  }

  static async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.success;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
    }

    return false;
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