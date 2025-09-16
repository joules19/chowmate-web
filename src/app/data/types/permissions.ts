export enum Role {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  MODERATOR = 'Moderator',
  SUPPORT = 'Support'
}

export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  
  // Users
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USER = 'CREATE_USER',
  EDIT_USER = 'EDIT_USER',
  DELETE_USER = 'DELETE_USER',
  SUSPEND_USER = 'SUSPEND_USER',
  
  // Vendors
  VIEW_VENDORS = 'VIEW_VENDORS',
  APPROVE_VENDOR = 'APPROVE_VENDOR',
  REJECT_VENDOR = 'REJECT_VENDOR',
  SUSPEND_VENDOR = 'SUSPEND_VENDOR',
  EDIT_VENDOR = 'EDIT_VENDOR',
  DELETE_VENDOR = 'DELETE_VENDOR',
  
  // Riders
  VIEW_RIDERS = 'VIEW_RIDERS',
  APPROVE_RIDER = 'APPROVE_RIDER',
  REJECT_RIDER = 'REJECT_RIDER',
  SUSPEND_RIDER = 'SUSPEND_RIDER',
  EDIT_RIDER = 'EDIT_RIDER',
  DELETE_RIDER = 'DELETE_RIDER',
  TRACK_RIDER = 'TRACK_RIDER',
  
  // Orders
  VIEW_ORDERS = 'VIEW_ORDERS',
  EDIT_ORDER = 'EDIT_ORDER',
  CANCEL_ORDER = 'CANCEL_ORDER',
  REFUND_ORDER = 'REFUND_ORDER',
  ASSIGN_RIDER = 'ASSIGN_RIDER',
  
  // Analytics
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  EXPORT_REPORTS = 'EXPORT_REPORTS',
  
  // Settings
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  EDIT_SETTINGS = 'EDIT_SETTINGS',
  MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS',
  
  // Advertisements
  VIEW_ADVERTISEMENTS = 'VIEW_ADVERTISEMENTS',
  CREATE_ADVERTISEMENT = 'CREATE_ADVERTISEMENT',
  EDIT_ADVERTISEMENT = 'EDIT_ADVERTISEMENT',
  DELETE_ADVERTISEMENT = 'DELETE_ADVERTISEMENT',
  TOGGLE_ADVERTISEMENT = 'TOGGLE_ADVERTISEMENT',
  
  // Feature Requests
  VIEW_FEATURE_REQUESTS = 'VIEW_FEATURE_REQUESTS',
  CREATE_FEATURE_REQUEST = 'CREATE_FEATURE_REQUEST',
  MANAGE_FEATURE_REQUESTS = 'MANAGE_FEATURE_REQUESTS',
  REVIEW_FEATURE_REQUESTS = 'REVIEW_FEATURE_REQUESTS',
  
  // System
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM'
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission),
  [Role.ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.SUSPEND_USER,
    Permission.VIEW_VENDORS,
    Permission.APPROVE_VENDOR,
    Permission.REJECT_VENDOR,
    Permission.SUSPEND_VENDOR,
    Permission.EDIT_VENDOR,
    Permission.VIEW_RIDERS,
    Permission.APPROVE_RIDER,
    Permission.REJECT_RIDER,
    Permission.SUSPEND_RIDER,
    Permission.EDIT_RIDER,
    Permission.TRACK_RIDER,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER,
    Permission.CANCEL_ORDER,
    Permission.ASSIGN_RIDER,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_FEATURE_REQUESTS,
    Permission.MANAGE_FEATURE_REQUESTS,
    Permission.REVIEW_FEATURE_REQUESTS
  ],
  [Role.MODERATOR]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.VIEW_VENDORS,
    Permission.APPROVE_VENDOR,
    Permission.REJECT_VENDOR,
    Permission.VIEW_RIDERS,
    Permission.APPROVE_RIDER,
    Permission.REJECT_RIDER,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER,
    Permission.ASSIGN_RIDER,
    Permission.VIEW_ANALYTICS
  ],
  [Role.SUPPORT]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.VIEW_VENDORS,
    Permission.VIEW_RIDERS,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER
  ]
};

export interface UserPermissions {
  role: Role;
  permissions: Permission[];
}

// Utility functions to match C# backend functionality
export class PermissionUtils {
  /**
   * Get all available permissions
   */
  static getAllPermissions(): Permission[] {
    return Object.values(Permission);
  }

  /**
   * Get permissions for a specific role
   */
  static getPermissionsForRole(role: Role | string): Permission[] {
    const roleKey = typeof role === 'string' ? role as Role : role;
    return RolePermissions[roleKey] || [];
  }

  /**
   * Check if a role has a specific permission
   */
  static hasPermission(role: Role | string, permission: Permission | string): boolean {
    const rolePermissions = this.getPermissionsForRole(role as Role);
    const permissionKey = typeof permission === 'string' ? permission as Permission : permission;
    return rolePermissions.includes(permissionKey);
  }

  /**
   * Check if a user has a specific permission based on their roles
   */
  static userHasPermission(userRoles: string[], permission: Permission | string): boolean {
    return userRoles.some(role => this.hasPermission(role as Role, permission));
  }

  /**
   * Get all permissions for multiple roles (useful for users with multiple roles)
   */
  static getPermissionsForRoles(roles: (Role | string)[]): Permission[] {
    const allPermissions = new Set<Permission>();
    roles.forEach(role => {
      const rolePermissions = this.getPermissionsForRole(role as Role);
      rolePermissions.forEach(permission => allPermissions.add(permission));
    });
    return Array.from(allPermissions);
  }

  /**
   * Check if a role exists in the system
   */
  static isValidRole(role: string): role is Role {
    return Object.values(Role).includes(role as Role);
  }

  /**
   * Check if a permission exists in the system
   */
  static isValidPermission(permission: string): permission is Permission {
    return Object.values(Permission).includes(permission as Permission);
  }
}