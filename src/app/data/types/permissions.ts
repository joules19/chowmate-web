export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  SUPPORT = 'SUPPORT'
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
    Permission.VIEW_AUDIT_LOGS
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