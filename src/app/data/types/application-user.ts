import { BaseEntity } from "./base-entity.js";

export interface ApplicationUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    roles: string[];
}

export interface User extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth?: string;
    isActive: boolean;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    lastLoginAt?: string;
    roles: string[];
    permissions: string[];
    profileImageUrl?: string;
    profileImagePublicId?: string;
    hasActiveOrders?: boolean;
    hasActiveDeliveries?: boolean;
}
