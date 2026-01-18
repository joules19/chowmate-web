import { PaginatedResponse } from "./api";

export enum StrikeStatus {
    Active = 0,
    Resolved = 1,
    Disputed = 2,
    ConvertedToDeduction = 3
}

export enum DisputeStatus {
    Pending = 0,
    UnderReview = 1,
    Approved = 2,
    Rejected = 3
}

export interface StrikeDto {
    id: string;
    vendorId: string;
    vendorBusinessName: string;
    reason: string;
    description: string;
    referenceNumber: string;
    status: StrikeStatus;
    statusDisplay: string;
    evidenceImageUrl: string | null;
    evidenceImageFileName: string | null;
    createdAt: string;
    resolvedAt: string | null;
    isDisputed: boolean;
    disputeStatus: DisputeStatus | null;
    disputeStatusDisplay: string | null;
    disputedAt: string | null;
    disputeEvidenceFiles?: DisputeEvidenceFileDto[];
    createdByAdminName: string;
}

export interface DisputeEvidenceFileDto {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
}

export interface StrikeDetailsDto extends StrikeDto {
    notes: string | null;
    disputeReason: string | null;
    disputeResolutionNotes: string | null;
    disputeReviewedAt: string | null;
    resolutionReason: string | null;
    metadata: string | null;
}

export interface StrikeSummaryDto {
    activeStrikeCount: number;
    strikeThreshold: number;
    activeStrikes: StrikeDto[];
}

export interface CreateStrikeRequest {
    vendorId: string;
    reason: string;
    description: string;
    evidenceImage?: File;
    notes?: string;
}

export interface ResolveStrikeRequest {
    resolutionReason: string;
    adminUserId: string;
    adminUserName: string;
}

export interface ReviewStrikeDisputeRequest {
    approve: boolean;
    resolutionNotes: string;
    adminUserId: string;
    adminUserName: string;
}

export interface StrikeFilters {
    vendorId?: string;
    status?: StrikeStatus;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
}

export interface DisputedStrikeFilters {
    disputeStatus?: DisputeStatus;
    pageNumber?: number;
    pageSize?: number;
}

export interface GetStrikesRequest {
    vendorId?: string;
    status?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
}

export interface GetDisputedStrikesRequest {
    disputeStatus?: string;
    pageNumber?: number;
    pageSize?: number;
}

export type PaginatedStrikesResponse = PaginatedResponse<StrikeDto>;
export type PaginatedStrikeDetailsResponse = PaginatedResponse<StrikeDetailsDto>;
