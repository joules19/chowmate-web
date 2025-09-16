import { BaseRepository } from '../base-repository';
import { 
  FeatureRequestResponseDto, 
  FeatureRequestFilterDto, 
  CreateFeatureRequestDto, 
  UpdateFeatureRequestStatusDto,
  FeatureRequestStats
} from '@/app/data/types/feature-request';
import { PaginatedResponse } from '@/app/data/types/api';

export class FeatureRequestRepository extends BaseRepository<FeatureRequestResponseDto> {
  constructor() {
    super('/api/common/feature-request');
  }

  async getFeatureRequests(filters?: FeatureRequestFilterDto): Promise<PaginatedResponse<FeatureRequestResponseDto>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const path = queryParams.toString() ? `?${queryParams}` : '';
    return this.get<PaginatedResponse<FeatureRequestResponseDto>>(path);
  }

  async createFeatureRequest(data: CreateFeatureRequestDto): Promise<FeatureRequestResponseDto> {
    return this.post<FeatureRequestResponseDto>('', data as unknown as Record<string, unknown>);
  }

  async getMyFeatureRequests(): Promise<FeatureRequestResponseDto[]> {
    return this.get<FeatureRequestResponseDto[]>('/my-requests');
  }

  async getFeatureRequest(id: string): Promise<FeatureRequestResponseDto> {
    return this.getById(id);
  }

  async updateFeatureRequestStatus(id: string, data: UpdateFeatureRequestStatusDto): Promise<FeatureRequestResponseDto> {
    return this.put<FeatureRequestResponseDto>(`/${id}/status`, data as unknown as Record<string, unknown>);
  }

  async deleteFeatureRequest(id: string): Promise<void> {
    return this.delete(id);
  }

  async getFeatureRequestStats(): Promise<FeatureRequestStats> {
    return this.get<FeatureRequestStats>('/stats');
  }

  async upvoteFeatureRequest(id: string): Promise<FeatureRequestResponseDto> {
    return this.post<FeatureRequestResponseDto>(`/${id}/upvote`);
  }

  async downvoteFeatureRequest(id: string): Promise<FeatureRequestResponseDto> {
    return this.post<FeatureRequestResponseDto>(`/${id}/downvote`);
  }
}