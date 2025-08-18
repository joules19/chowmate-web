import { BaseEntity } from "./base-entity";
import { Customer } from "./customer";


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
}

export enum VendorStatus {
  PendingApproval = 'PendingApproval',
  Approved = 'Approved',
  UnderReview = 'UnderReview',
  Suspended = 'Suspended',
  Rejected = 'Rejected',
  RequiresManualReview = 'RequiresManualReview'
}

export enum OrderStatus {
  Pending = 'Pending',
  Preparing = 'Preparing',
  RiderAssigned = 'RiderAssigned',
  RiderArrived = 'RiderArrived',
  OutForDelivery = 'OutForDelivery',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum RiderStatus {
  PendingVerification = 'PendingVerification',
  Active = 'Active',
  Suspended = 'Suspended',
  Inactive = 'Inactive'
}

export enum LocationConfidenceLevel {
  Unknown = 'Unknown',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface BusinessType extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

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
  businessType?: BusinessType;
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
  rejectedAt?: string;
  rejectionReason?: string;
  approvalNotes?: string;
  locationConfidence: LocationConfidenceLevel;
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

export interface Order extends BaseEntity {
  orderId: string;
  transactionId: string;
  vendorId: string;
  vendor: Vendor;
  customerId: string;
  customer: Customer;
  riderId?: string;
  orderDate: string;
  status: OrderStatus;
  isGift: boolean;
  isPickUp: boolean;
  isDelivery: boolean;
  promotionId?: string;
  promoCode?: string;
  orderPin?: string;
  deliveryPin?: string;
  deliveryAddress?: string;
  deliveryAddressId?: string;
  promoDiscountAmount?: number;
  subTotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  totalAmount: number;
  orderIndex: number;
  preparingAt?: string;
  riderAssignedAt?: string;
  riderArrivedAt?: string;
  outForDeliveryAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}