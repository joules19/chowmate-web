import { Permission, Role, RolePermissions, UserPermissions } from "../../data/types/permissions";

export class PermissionService {
  private static userPermissions: UserPermissions | null = null;

  static setUserPermissions(permissions: UserPermissions): void {
    this.userPermissions = permissions;
  }

  static getUserPermissions(): UserPermissions | null {
    return this.userPermissions;
  }

  static hasPermission(permission: Permission): boolean {
    if (!this.userPermissions) {
      return false;
    }

    return this.userPermissions.permissions.includes(permission);
  }

  static hasRole(role: Role): boolean {
    if (!this.userPermissions) {
      return false;
    }

    return this.userPermissions.role === role;
  }

  static hasAnyRole(roles: Role[]): boolean {
    if (!this.userPermissions) {
      return false;
    }

    return roles.includes(this.userPermissions.role);
  }

  static hasAnyPermission(permissions: Permission[]): boolean {
    if (!this.userPermissions) {
      return false;
    }

    return permissions.some(permission => 
      this.userPermissions!.permissions.includes(permission)
    );
  }

  static canAccess(requiredPermissions: Permission | Permission[]): boolean {
    if (!this.userPermissions) {
      return false;
    }

    const permissions = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];

    return permissions.every(permission => 
      this.userPermissions!.permissions.includes(permission)
    );
  }

  static getPermissionsForRole(role: Role): Permission[] {
    return RolePermissions[role] || [];
  }

  static isAdmin(): boolean {
    return this.hasAnyRole([Role.SUPER_ADMIN, Role.ADMIN]);
  }

  static isSuperAdmin(): boolean {
    return this.hasRole(Role.SUPER_ADMIN);
  }

  static canManageUsers(): boolean {
    return this.hasAnyPermission([
      Permission.CREATE_USER,
      Permission.EDIT_USER,
      Permission.DELETE_USER,
      Permission.SUSPEND_USER
    ]);
  }

  static canManageVendors(): boolean {
    return this.hasAnyPermission([
      Permission.APPROVE_VENDOR,
      Permission.REJECT_VENDOR,
      Permission.SUSPEND_VENDOR,
      Permission.EDIT_VENDOR,
      Permission.DELETE_VENDOR
    ]);
  }

  static canManageRiders(): boolean {
    return this.hasAnyPermission([
      Permission.APPROVE_RIDER,
      Permission.REJECT_RIDER,
      Permission.SUSPEND_RIDER,
      Permission.EDIT_RIDER,
      Permission.DELETE_RIDER
    ]);
  }

  static canManageOrders(): boolean {
    return this.hasAnyPermission([
      Permission.EDIT_ORDER,
      Permission.CANCEL_ORDER,
      Permission.REFUND_ORDER,
      Permission.ASSIGN_RIDER
    ]);
  }

  static clearPermissions(): void {
    this.userPermissions = null;
  }
}