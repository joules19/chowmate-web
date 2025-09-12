import { ApplicationUser } from "./application-user";
import { BaseEntity } from "./base-entity.js";

export enum RiderStatus {
    PendingVerification = 'PendingVerification',
    UnderReview = 'UnderReview',
    Available = 'Available',
    Busy = 'Busy',
    Offline = 'Offline',
    OnBreak = 'OnBreak',
    Suspended = 'Suspended',
    Rejected = 'Rejected'
}

export interface Rider extends BaseEntity {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    userId: string;
    user: ApplicationUser;
    status: RiderStatus;
    currentLatitude?: number;
    currentLongitude?: number;
    lastLocationUpdate?: string;
    isOnline: boolean;
    averageDeliveryTime?: string;
    rating: number;
    completedDeliveries: number;
    cancelledDeliveries: number;
    acceptanceRate: number;
    vehicleType?: string;
    maxDeliveryRadius: number;
    locationAccuracy?: number;
    lastOnlineAt?: string;
    maxDeliveryRadiusKm: number;
    maxConcurrentOrders: number;
}

// API response structure for rider management
export interface RiderSummary extends Record<string, unknown> {
    id: string;
    fullName: string;
    phoneNumber: string;
    status: number; // numeric status from API
    statusText: string;
    isOnline: boolean;
    rating: number;
    acceptanceRate: number;
    completedDeliveries: number;
    currentLatitude?: number;
    currentLongitude?: number;
    lastLocationUpdate?: string;
    vehicleType?: string;
    activeAssignments: number;
}
