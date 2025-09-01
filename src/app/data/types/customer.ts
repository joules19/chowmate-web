import { BaseEntity } from "./base-entity.js";
import { ApplicationUser } from "./entities";

export interface Customer extends BaseEntity {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    status: CustomerStatus;
    userId: string;
    user: ApplicationUser;
    createdAt: string;
    lastLoginAt?: string;
    suspendedAt?: string;
    suspensionReason?: string;
    profileImageUrl?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;

    // Calculated properties
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
    customerSince: string;
    lastActivity: string;
}

export interface CustomerAddress extends BaseEntity {
    customerId: string;
    address: string;
    latitude?: number;
    longitude?: number;
    isDefault: boolean;
    label?: string;
}


export interface CustomerSummary {
    id: string;
    fullName: string;
    email: string;
    status: string;
    totalOrders: number;
    totalSpent: number;
    createdAt: string;
    lastLoginAt?: string;
}

export interface CustomerOrderHistory {
    orderId: string;
    vendorName: string;
    totalAmount: number;
    status: string;
    orderDate: string;
    deliveredAt?: string;
}

export interface CustomerStats {
    totalCustomers: number;
    activeCustomers: number;
    suspendedCustomers: number;
    newCustomersThisMonth: number;
    averageOrderValue: number;
    totalRevenue: number;
}

export type CustomerStatus = 'Active' | 'Suspended' | 'Inactive' | 'Banned';

export interface CustomerFilters {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    city?: string;
    state?: string;
    minSpent?: number;
    maxSpent?: number;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface CustomerActionRequest {
    reason?: string;
    notifyCustomer?: boolean;
    [key: string]: unknown;
}

export interface SuspendCustomerRequest extends CustomerActionRequest {
    reason: string;
    suspensionEndDate?: string;
}

export interface UpdateCustomerStatusRequest extends CustomerActionRequest {
    status: CustomerStatus;
}

export interface DeleteCustomerRequest extends CustomerActionRequest {
    reason: string;
    permanentDelete?: boolean;
}