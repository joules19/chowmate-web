import { PaginatedResponse } from "./api";

export enum DeductionStatus {
    Pending = 0,
    PartiallyPaid = 1,
    FullyPaid = 2,
    Disputed = 3,
    Cancelled = 4,
    Expired = 5
}

export enum DeductionPriority {
    Critical = "Critical",
    High = "High",
    Medium = "Medium",
    Low = "Low"
}

export enum DisputeStatus {
    Pending = 0,
    UnderReview = 1,
    Approved = 2,
    Rejected = 3
}

export enum DeductionPaymentSource {
    OrderEarnings = "OrderEarnings",
    ManualCharge = "ManualCharge",
    WalletCredit = "WalletCredit"
}

export interface DeductionDto {
    id: string;
    vendorId: string;
    vendorBusinessName: string;
    amount: number;
    outstandingAmount: number;
    paidAmount: number;
    description: string;
    reason: string;
    referenceNumber: string;
    status: DeductionStatus;
    statusDisplay: string;
    priority: DeductionPriority;
    priorityDisplay: string;
    priorityOrder: number;
    createdAt: string;
    chargeableAfter: string;
    isInGracePeriod: boolean;
    hoursUntilChargeable: number;
    isChargeable: boolean;
    fullyPaidAt: string | null;
    expiresAt: string | null;
    isDisputed: boolean;
    disputeStatus: DisputeStatus | null;
    disputeStatusDisplay: string | null;
    disputedAt: string | null;
    createdByAdminName: string;
    disputeEvidenceFiles?: DisputeEvidenceFileDto[];
}

export interface DisputeEvidenceFileDto {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
}

export interface DeductionPaymentHistoryDto {
    id: string;
    amount: number;
    reference: string;
    source: DeductionPaymentSource;
    createdAt: string;
    sourceOrderId: string | null;
    sourceOrderNumber: string | null;
}

export interface DeductionDetailsDto extends DeductionDto {
    notes: string | null;
    disputeReason: string | null;
    disputeResolutionNotes: string | null;
    disputeReviewedAt: string | null;
    cancellationReason: string | null;
    cancelledAt: string | null;
    payments: DeductionPaymentHistoryDto[];
}

export interface DeductionSummaryDto {
    totalOutstanding: number;
    totalPaid: number;
    pendingCount: number;
    disputedCount: number;
    recentDeductions: DeductionDto[];
}

export interface CreateDeductionRequest {
    vendorId: string;
    amount: number;
    description: string;
    reason: string;
    priority: DeductionPriority;
    priorityOrder: number;
    expiresAt?: string;
    notes?: string;
    adminUserId: string;
    adminUserName: string;
}

export interface UpdateDeductionRequest {
    description?: string;
    priority?: DeductionPriority;
    priorityOrder?: number;
    expiresAt?: string;
    notes?: string;
    adminUserId: string;
    adminUserName: string;
}

export interface CancelDeductionRequest {
    cancellationReason: string;
    adminUserId: string;
    adminUserName: string;
}

export interface ReviewDisputeRequest {
    approve: boolean;
    resolutionNotes: string;
    adminUserId: string;
    adminUserName: string;
}

export interface DeductionFilters {
    vendorId?: string;
    status?: DeductionStatus;
    priority?: DeductionPriority;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
}

export interface DeductionProcessingResultDto {
    vendorId: string;
    vendorName: string;
    deductionsProcessed: number;
    totalAmountDeducted: number;
    walletBalanceBefore: number;
    walletBalanceAfter: number;
    processedAt: string;
    processedBy: string;
    processingType: string;
    payments: DeductionPaymentHistoryDto[];
}
