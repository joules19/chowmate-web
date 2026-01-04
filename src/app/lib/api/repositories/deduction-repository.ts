import {
    DeductionDto,
    DeductionDetailsDto,
    CreateDeductionRequest,
    UpdateDeductionRequest,
    CancelDeductionRequest,
    ReviewDisputeRequest,
    DeductionFilters,
    DeductionProcessingResultDto,
    DeductionPaymentHistoryDto,
} from '@/app/data/types/deductions';
import { BaseRepository } from '../base-repository';
import { PaginatedResponse } from '@/app/data/types/api';

export class DeductionRepository extends BaseRepository<DeductionDto> {
    constructor() {
        super('api/admin/deductions');
    }

    async getAllDeductions(filters?: DeductionFilters): Promise<PaginatedResponse<DeductionDto>> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const endpoint = queryParams.toString() ? `?${queryParams}` : '';
        return this.get<PaginatedResponse<DeductionDto>>(endpoint);
    }

    async getDeductionById(deductionId: string): Promise<DeductionDetailsDto> {
        return this.get<DeductionDetailsDto>(`/${deductionId}`);
    }

    async createDeduction(request: CreateDeductionRequest): Promise<DeductionDto> {
        return this.post<DeductionDto>('', request as unknown as Record<string, unknown>);
    }

    async updateDeduction(deductionId: string, request: UpdateDeductionRequest): Promise<DeductionDto> {
        return this.put<DeductionDto>(`/${deductionId}`, request as unknown as Record<string, unknown>);
    }

    async cancelDeduction(deductionId: string, request: CancelDeductionRequest): Promise<void> {
        return this.deleteRequest<void>(`/${deductionId}`, request as unknown as Record<string, unknown>);
    }

    async listDisputedDeductions(filters?: DeductionFilters): Promise<PaginatedResponse<DeductionDto>> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const endpoint = `/disputes?${queryParams}`;
        return this.get<PaginatedResponse<DeductionDto>>(endpoint);
    }

    async reviewDispute(deductionId: string, request: ReviewDisputeRequest): Promise<DeductionDto> {
        return this.post<DeductionDto>(`/${deductionId}/review-dispute`, request as unknown as Record<string, unknown>);
    }

    async processDeductionsForVendor(vendorId: string): Promise<DeductionProcessingResultDto> {
        return this.post<DeductionProcessingResultDto>(`/process/${vendorId}`);
    }

    async processSingleDeduction(deductionId: string): Promise<DeductionPaymentHistoryDto> {
        return this.post<DeductionPaymentHistoryDto>(`/process-single/${deductionId}`);
    }
}
