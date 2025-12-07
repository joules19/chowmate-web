import { BaseEntity } from "./base-entity.js";
import { Customer } from "./customer";
import { Vendor } from "./vendor";
import { RiderStatus } from "./rider";

// API response structure for order management
export interface CustomerAddressDto {
  id: string;
  customerId: string;
  isDefault: boolean;
  addressLine1?: string;
  addressLine2?: string;
  latitude: number;
  longitude: number;
  primaryLandmarkId: string;
  directionsFromLandmark: string;
  deliveryZoneId: string;
  primaryPhone?: string;
  backupPhone?: string;
  isPopular: boolean;
  landmarkName?: string;
  zoneName?: string;
}

export interface CustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: CustomerAddressDto;
}

export interface VendorInfo {
  id: string;
  businessName?: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber: string;
}

export interface RiderInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: RiderStatus;
  rating: number;
}

export interface OptionDto {
  optionId: string;
  optionName: string;
  price: number;
}

export interface OrderItemDetailsDto {
  productId: string;
  productName: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
  selectedOptions: OptionDto[];
  imageUrl?: string;
}

export interface AllOrdersDto extends Record<string, unknown> {
  id: string;
  orderId: string;
  orderDate: string;
  status: number;
  statusText: string;
  totalAmount: number;
  subTotal: number;
  deliveryFee: number;
  serviceFee: number;

  // Nested objects
  customer: CustomerInfo;
  vendor: VendorInfo;
  rider?: RiderInfo;

  // Order details
  isDelivery: boolean;
  isPickUp: boolean;
  isGift: boolean;
  deliveryAddress?: string;
  promoCode?: string;
  promoDiscountAmount?: number;

  // Timestamps
  preparingAt?: string;
  riderAssignedAt?: string;
  riderArrivedAt?: string;
  outForDeliveryAt?: string;
  completedAt?: string;
  cancelledAt?: string;

  // Additional info
  assignmentAttempts: number;
  orderDuration?: string;

  // Order items
  orderItems: OrderItemDetailsDto[];
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


export enum OrderStatus {
  Pending = 'Pending',
  Preparing = 'Preparing',
  RiderAssigned = 'RiderAssigned',
  NoRiderFound = 'NoRiderFound',
  RiderArrived = 'RiderArrived',
  OutForDelivery = 'OutForDelivery',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}


export interface PendingOrderDto {
  id: string;
  orderId: string;
  orderDate: string;
  status: OrderStatus;
  statusText: string;
  totalAmount: number;
  vendorName: string;
  customerName: string;
  deliveryAddress: string;
  isDelivery: boolean;
  assignmentAttempts: number;
  lastAssignmentAttempt?: string;
}

export interface AvailableRiderDto {
  id: string;
  fullName: string;
  phoneNumber: string;
  status: RiderStatus;
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

export interface AssignmentResultDto {
  assignmentId: string;
  orderId: string;
  riderId: string;
  orderNumber: string;
  riderName: string;
  assignedAt: string;
  success: boolean;
  message: string;
  deliveryFee: number;
  estimatedDistanceKm: number;
  estimatedTotalTime: string; // TimeSpan as ISO duration string
}

export interface AssignRiderToOrderRequest {
  orderId: string;
  riderId: string;
  notes?: string;
  [key: string]: unknown;
}