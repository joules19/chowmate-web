import { ApplicationUser } from "./application-user";
import { BaseEntity } from "./base-entity.js";
import { LocationConfidenceLevel } from "./location";

export interface Vendor extends BaseEntity {
    businessName?: string;
    firstName: string;
    lastName: string;
    rcNumber?: string;
    description?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    preparationTime?: string;
    averagePreparationTime?: string;
    preparationTimeAccuracy: number;
    coverPublicId?: string;
    logoPublicId?: string;
    phoneNumber: string;
    email: string;
    businessPhoneNumber?: string;
    businessEmail?: string;
    userId: string;
    user: ApplicationUser;
    businessTypeId?: string;
    businessType?: string;
    status: VendorStatus;
    isActive: boolean;
    isOpen: boolean;
    latitude?: number;
    longitude?: number;
    address?: string;
    offersDelivery: boolean;
    offersPickup: boolean;
    deliveryRadius: number;
    minimumOrderAmount: number;
    maxDeliveryRadiusKm: number;
    minimumOrderForDelivery: number;
    approvedAt?: string;
    suspendedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    approvalNotes?: string;
    locationConfidence: LocationConfidenceLevel;
}

export interface BusinessType extends BaseEntity {
    name: string;
    description?: string;
    isActive: boolean;
}

// Vendor Types and Interfaces - Updated with correct structure

export enum VendorStatus {
    PendingApproval = 'PendingApproval',
    Approved = 'Approved',
    UnderReview = 'UnderReview',
    Suspended = 'Suspended',
    Rejected = 'Rejected',
    RequiresManualReview = 'RequiresManualReview',
    Inactive = 'Inactive'
}

export enum DeliveryType {
    None = 'None',
    DeliveryOnly = 'DeliveryOnly',
    PickupOnly = 'PickupOnly',
    Both = 'Both'
}

export interface VendorUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    roles: string[];
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
}

export interface BusinessLocation {
    id: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    isVerified: boolean;
    verifiedAt?: string;
    verifiedBy?: string;
}

export interface OpeningHours {
    id: string;
    day: number; // 0 = Sunday, 1 = Monday, etc. (DayOfWeek enum)
    openTime: string; // TimeSpan as string "HH:mm:ss"
    closeTime: string; // TimeSpan as string "HH:mm:ss"
    isClosed: boolean;
    storeOperationId: string;
    vendorId?: string;
}

export interface StoreOperation {
    id: string;
    vendorId: string;
    deliveryType: DeliveryType;
    orderCutoffTime?: string; // TimeSpan as string "HH:mm:ss"
    menuReadyTime?: string; // TimeSpan as string "HH:mm:ss"
    openingHours: OpeningHours[];
    // Legacy fields for backward compatibility
    isOpen?: boolean;
    offersDelivery?: boolean;
    offersPickup?: boolean;
    deliveryRadius?: number;
    minimumOrderAmount?: number;
    maxDeliveryRadiusKm?: number;
    minimumOrderForDelivery?: number;
    preparationTimeAccuracy?: number;
}

export interface BusinessInformation {
    id: string;
    businessName: string;
    businessType: string;
    businessRegistrationNumber?: string;
    taxId?: string;
    description?: string;
    website?: string;
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };
    establishedYear?: number;
    numberOfEmployees?: number;
}

export interface VendorDocuments {
    id: string;
    businessLicense?: DocumentInfo;
    foodSafetyPermit?: DocumentInfo;
    insuranceCertificate?: DocumentInfo;
    identificationDocument?: DocumentInfo;
    additionalDocuments?: DocumentInfo[];
}

export interface DocumentInfo {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    isVerified: boolean;
    verifiedAt?: string;
    verifiedBy?: string;
    expiryDate?: string;
}

export interface VendorSummary {
    id: string;
    businessName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    status: VendorStatus;
    isActive: boolean;
    isZoneAssigned: boolean;
    totalOrders: number;
    totalRevenue: number;
    rating: number;
    logoUrl?: string;
    createdAt: string;
    lastActiveAt?: string;
    city: string;
    state: string;
    deliveryType: DeliveryType;
    isCurrentlyOpen: boolean;
    complianceScore: number;
}

export interface VendorDetails extends Vendor {
    isZoneAssigned: boolean;
    businessInformation: BusinessInformation;
    businessLocation: BusinessLocation;
    storeOperations: StoreOperation;
    documents: VendorDocuments;
    zoneAssignments: VendorZoneAssignment[];
    // Performance metrics
    totalOrders: number;
    totalRevenue: number;
    rating: number;
    reviewCount: number;
    vendorSince: string;
    rcNumber: string;
    lastActivity?: string;
    complianceScore: number;
    performanceMetrics: {
        orderAcceptanceRate: number;
        onTimeDeliveryRate: number;
        customerSatisfactionScore: number;
        averagePreparationTime: number;
        fulfillmentRate: number;
        responseTime: number;
    };
    // Verification status
    verificationStatus: {
        emailVerified: boolean;
        phoneVerified: boolean;
        businessVerified: boolean;
        documentVerified: boolean;
        locationVerified: boolean;
        overallVerified: boolean;
    };
}

export interface VendorZoneAssignment {
    id: string;
    vendorId: string;
    vendorName: string;
    zoneId: string;
    zoneName: string;
    zoneDescription?: string;
    canDeliverTo: boolean;
    customDeliveryFee?: number;
    customDeliveryTime?: string; // TimeSpan as string "HH:mm:ss"
    isActive: boolean;
    assignedAt: string;
    assignedBy: string;
    assignedByName: string;
}

export interface DeliveryZone {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    deliveryFee: number;
    estimatedDeliveryTime: string; // TimeSpan as string
    coordinates?: {
        latitude: number;
        longitude: number;
        radius: number;
    };
    createdAt: string;
    updatedAt?: string;
}

export interface VendorStats {
    totalVendors: number;
    pendingApproval: number;
    approved: number;
    suspended: number;
    rejected: number;
    inactive: number;
    requiresManualReview: number;
    newVendorsThisMonth: number;
    newVendorsThisWeek: number;
    totalRevenue: number;
    averageRating: number;
    activeVendors: number;
    zoneAssignedVendors: number;
    verifiedVendors: number;
    // Performance metrics
    averageApprovalTime: number; // in hours
    averageComplianceScore: number;
    vendorsWithIssues: number;
}

export interface VendorFilters {
    search?: string;
    status?: VendorStatus | string;
    city?: string;
    state?: string;
    isZoneAssigned?: boolean;
    isVerified?: boolean;
    deliveryType?: DeliveryType;
    dateFrom?: string;
    dateTo?: string;
    minRating?: number;
    maxRating?: number;
    businessType?: string;
    complianceScore?: number;
    isCurrentlyOpen?: boolean;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Request types
export interface ApproveVendorRequest extends Record<string, unknown> {
    reason?: string;
    notifyVendor?: boolean;
    autoAssignZone?: boolean;
    zoneId?: string;
    sendWelcomePackage?: boolean;
}

export interface RejectVendorRequest extends Record<string, unknown> {
    reason: string;
    notifyVendor?: boolean;
    allowReapplication?: boolean;
    specificIssues?: string[];
}

export interface SuspendVendorRequest extends Record<string, unknown> {
    reason: string;
    suspensionEndDate?: string;
    notifyVendor?: boolean;
    suspendOrders?: boolean;
    severity?: 'Minor' | 'Major' | 'Critical';
}

export interface ActivateVendorRequest extends Record<string, unknown> {
    reason?: string;
    notifyVendor?: boolean;
    restoreZoneAssignments?: boolean;
}

export interface UpdateVendorStatusRequest extends Record<string, unknown> {
    status: VendorStatus;
    reason?: string;
    notifyVendor?: boolean;
}

export interface AssignVendorToZoneRequest extends Record<string, unknown> {
    zoneId: string;
    canDeliverTo?: boolean;
    customDeliveryFee?: number;
    customDeliveryTime?: string; // TimeSpan as string "HH:mm:ss"
}

export interface SendInstructionRequest extends Record<string, unknown> {
    subject: string;
    message: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    requireAcknowledgment?: boolean;
    category?: string;
    scheduledDelivery?: string; // ISO date string
    attachments?: string[]; // File URLs
}

export interface VendorActivity {
    id: string;
    vendorId: string;
    activityType: string;
    description: string;
    performedBy: string;
    performedByName: string;
    createdAt: string;
    metadata?: Record<string, unknown>;
}

// Utility types for working with opening hours
export interface DaySchedule {
    dayName: string;
    dayNumber: number;
    isClosed: boolean;
    openTime?: string;
    closeTime?: string;
    isToday: boolean;
}

export interface OperatingStatus {
    isCurrentlyOpen: boolean;
    nextOpenTime?: string;
    nextCloseTime?: string;
    todaySchedule?: DaySchedule;
}

// Role switching types
export type UserRole = 'Customer' | 'Vendor' | 'Rider';

export interface RoleSwitchRequest extends Record<string, unknown> {
    fromRole: UserRole;
    toRole: UserRole;
    reason?: string;
    notifyUser: boolean;
}

export interface RoleSwitchResponse {
    userId: string;
    fromRole: string;
    toRole: string;
    switchedAt: string;
    switchedBy: string;
    reason?: string;
}

export interface UserSummaryDto {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth?: string;
    city?: string;
    state?: string;
    role: string; // Primary role
    status: string; // Role-specific status
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    createdAt: string;
    lastLoginAt?: string;
    // Role-specific data
    businessName?: string; // For vendors
    totalOrders?: number; // For customers/vendors
    totalSpent?: number; // For customers
    totalEarnings?: number; // For vendors/riders
    isOnline?: boolean; // For riders
    rating?: number; // For vendors/riders
    // Status indicators
    hasActiveOrders: boolean;
    hasActiveDeliveries: boolean;
    suspensionReason?: string;
    suspendedAt?: string;
    // Calculated fields
    lastActivity: string;
    memberSince: string;
}

export interface UserForRoleSwitch {
    userId: string;
    name: string;
    email: string;
    phone: string;
    currentRole: UserRole;
    status: string;
    hasActiveOrders?: boolean;
    hasActiveDeliveries?: boolean;
}

export interface GetAllUsersRequest extends Record<string, unknown> {
    search?: string;
    role?: string; // Filter by role: Customer, Vendor, Rider, Admin
    status?: string; // Filter by status
    dateFrom?: string;
    dateTo?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isActive?: boolean;
    city?: string;
    state?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}