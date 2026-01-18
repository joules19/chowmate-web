import {
    StrikeDto,
    StrikeDetailsDto,
    CreateStrikeRequest,
    ResolveStrikeRequest,
    ReviewStrikeDisputeRequest,
    StrikeFilters,
    DisputedStrikeFilters,
    StrikeSummaryDto,
} from '@/app/data/types/strikes';
import { BaseRepository } from '../base-repository';
import { PaginatedResponse } from '@/app/data/types/api';

export class StrikeRepository extends BaseRepository<StrikeDto> {
    constructor() {
        super('api/admin/strikes');
    }

    async getAllStrikes(filters?: StrikeFilters): Promise<PaginatedResponse<StrikeDto>> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const endpoint = queryParams.toString() ? `?${queryParams}` : '';
        return this.get<PaginatedResponse<StrikeDto>>(endpoint);
    }

    async getStrikeById(strikeId: string): Promise<StrikeDetailsDto> {
        return this.get<StrikeDetailsDto>(`/${strikeId}`);
    }

    async createStrike(request: CreateStrikeRequest): Promise<StrikeDto> {
        const formData = new FormData();
        formData.append('VendorId', request.vendorId);
        formData.append('Reason', request.reason);
        formData.append('Description', request.description);

        if (request.evidenceImage) {
            formData.append('EvidenceImage', request.evidenceImage);
        }

        if (request.notes) {
            formData.append('Notes', request.notes);
        }

        return this.post<StrikeDto>('', formData);
    }

    async resolveStrike(strikeId: string, request: ResolveStrikeRequest): Promise<boolean> {
        return this.post<boolean>(`/${strikeId}/resolve`, request as unknown as Record<string, unknown>);
    }

    async listDisputedStrikes(filters?: DisputedStrikeFilters): Promise<PaginatedResponse<StrikeDto>> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const endpoint = `/disputes${queryParams.toString() ? `?${queryParams}` : ''}`;
        return this.get<PaginatedResponse<StrikeDto>>(endpoint);
    }

    async reviewStrikeDispute(strikeId: string, request: ReviewStrikeDisputeRequest): Promise<StrikeDto> {
        return this.post<StrikeDto>(`/${strikeId}/dispute/review`, request as unknown as Record<string, unknown>);
    }

    async getVendorStrikeSummary(vendorId: string): Promise<StrikeSummaryDto> {
        return this.get<StrikeSummaryDto>(`/vendor/${vendorId}/summary`);
    }
}
