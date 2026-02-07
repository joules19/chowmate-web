export enum Role {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  MODERATOR = 'Moderator',
  SUPPORT = 'Support',
  RIDER_ADMIN = 'RiderAdmin',
  OPERATIONS_ADMIN = 'OperationsAdmin',

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

  // Products
  VIEW_PRODUCTS = 'VIEW_PRODUCTS',
  APPROVE_PRODUCT = 'APPROVE_PRODUCT',
  REJECT_PRODUCT = 'REJECT_PRODUCT',
  MANAGE_PRODUCTS = 'MANAGE_PRODUCTS',

  // Product Promotions
  VIEW_PROMOTIONS = 'VIEW_PROMOTIONS',
  CREATE_PROMOTION = 'CREATE_PROMOTION',
  EDIT_PROMOTION = 'EDIT_PROMOTION',
  DELETE_PROMOTION = 'DELETE_PROMOTION',
  TOGGLE_PROMOTION = 'TOGGLE_PROMOTION',
  BULK_MANAGE_PROMOTIONS = 'BULK_MANAGE_PROMOTIONS',

  // Payments
  VIEW_PAYMENTS = 'VIEW_PAYMENTS',
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS',
  FUND_WALLET = 'FUND_WALLET',
  VIEW_WALLET_TRANSACTIONS = 'VIEW_WALLET_TRANSACTIONS',
  PROCESS_REFUNDS = 'PROCESS_REFUNDS',
  VIEW_PAYMENT_ANALYTICS = 'VIEW_PAYMENT_ANALYTICS',

  // Deductions
  VIEW_DEDUCTIONS = 'VIEW_DEDUCTIONS',
  MANAGE_DEDUCTIONS = 'MANAGE_DEDUCTIONS',

  // Surveys
  VIEW_SURVEYS = 'VIEW_SURVEYS',
  CREATE_SURVEY = 'CREATE_SURVEY',
  EDIT_SURVEY = 'EDIT_SURVEY',
  DELETE_SURVEY = 'DELETE_SURVEY',
  MANAGE_SURVEYS = 'MANAGE_SURVEYS',
  VIEW_SURVEY_RESPONSES = 'VIEW_SURVEY_RESPONSES',
  VIEW_SURVEY_ANALYTICS = 'VIEW_SURVEY_ANALYTICS',

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
    Permission.REVIEW_FEATURE_REQUESTS,
    Permission.VIEW_PRODUCTS,
    Permission.APPROVE_PRODUCT,
    Permission.REJECT_PRODUCT,
    Permission.MANAGE_PRODUCTS,
    Permission.VIEW_PROMOTIONS,
    Permission.CREATE_PROMOTION,
    Permission.EDIT_PROMOTION,
    Permission.DELETE_PROMOTION,
    Permission.TOGGLE_PROMOTION,
    Permission.BULK_MANAGE_PROMOTIONS,
    Permission.VIEW_PAYMENTS,
    Permission.MANAGE_PAYMENTS,
    Permission.FUND_WALLET,
    Permission.VIEW_WALLET_TRANSACTIONS,
    Permission.PROCESS_REFUNDS,
    Permission.VIEW_PAYMENT_ANALYTICS,
    Permission.VIEW_DEDUCTIONS,
    Permission.MANAGE_DEDUCTIONS,
    Permission.VIEW_SURVEYS,
    Permission.CREATE_SURVEY,
    Permission.EDIT_SURVEY,
    Permission.DELETE_SURVEY,
    Permission.MANAGE_SURVEYS,
    Permission.VIEW_SURVEY_RESPONSES,
    Permission.VIEW_SURVEY_ANALYTICS
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
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_PRODUCTS,
    Permission.APPROVE_PRODUCT,
    Permission.REJECT_PRODUCT
  ],
  [Role.SUPPORT]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.VIEW_VENDORS,
    Permission.VIEW_RIDERS,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER
  ],
  [Role.OPERATIONS_ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.VIEW_VENDORS,
    Permission.VIEW_RIDERS,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER,
    Permission.CANCEL_ORDER,
    Permission.REFUND_ORDER,
    Permission.ASSIGN_RIDER,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_PAYMENTS,
    Permission.MANAGE_PAYMENTS,
    Permission.FUND_WALLET,
    Permission.VIEW_WALLET_TRANSACTIONS,
    Permission.PROCESS_REFUNDS,
    Permission.VIEW_PAYMENT_ANALYTICS,
    Permission.VIEW_ADVERTISEMENTS,
    Permission.CREATE_ADVERTISEMENT,
    Permission.EDIT_ADVERTISEMENT,
    Permission.DELETE_ADVERTISEMENT,
    Permission.TOGGLE_ADVERTISEMENT,
    Permission.VIEW_FEATURE_REQUESTS,
    Permission.CREATE_FEATURE_REQUEST,
    Permission.MANAGE_FEATURE_REQUESTS,
    Permission.REVIEW_FEATURE_REQUESTS,
    Permission.VIEW_PROMOTIONS,
    Permission.CREATE_PROMOTION,
    Permission.EDIT_PROMOTION,
    Permission.DELETE_PROMOTION,
    Permission.TOGGLE_PROMOTION,
    Permission.BULK_MANAGE_PROMOTIONS
  ],
  [Role.RIDER_ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_RIDERS,
    Permission.APPROVE_RIDER,
    Permission.REJECT_RIDER,
    Permission.SUSPEND_RIDER,
    Permission.EDIT_RIDER,
    Permission.DELETE_RIDER,
    Permission.TRACK_RIDER,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER,
    Permission.CANCEL_ORDER,
    Permission.ASSIGN_RIDER,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_REPORTS
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