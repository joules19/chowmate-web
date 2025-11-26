export enum EarningsDistributionStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
  Refunding = 4,
  Refunded = 5
}

export interface OrderEarningsDto {
  id: string;
  orderId: string;
  orderNumber: string;

  // Vendor information
  vendorId: string;
  vendorName: string;
  vendorEarnings: number;

  // Rider information
  riderId?: string;
  riderName?: string;
  riderEarnings: number;

  // Platform earnings
  platformEarnings: number;

  // Order breakdown
  subTotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;

  // Commission rates
  platformCommissionRate: number;
  riderCommissionRate: number;

  // Distribution status
  distributionStatus: EarningsDistributionStatus;
  distributionStatusText: string;
  distributedAt?: string;
  refundedAt?: string;
  distributionNotes?: string;

  // Timestamps
  createdDate: string;
  modifiedDate?: string;
}

export interface GetOrderEarningsRequest {
  fromDate?: string;
  toDate?: string;
  vendorId?: string;
  distributionStatus?: EarningsDistributionStatus;
  pageNumber?: number;
  pageSize?: number;
}
