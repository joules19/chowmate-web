import { AvatarPresetDto, CreateAvatarPresetRequest } from '@/app/data/types/avatar-preset';
import { BaseRepository } from '../base-repository';

export class AvatarPresetRepository extends BaseRepository<AvatarPresetDto> {
  constructor() {
    super('api/admin/avatar-presets');
  }

  async getAvatarPresets(includeInactive = false): Promise<AvatarPresetDto[]> {
    const query = includeInactive ? '?includeInactive=true' : '';
    return this.get<AvatarPresetDto[]>(query);
  }

  async createAvatarPreset(request: CreateAvatarPresetRequest): Promise<AvatarPresetDto> {
    return this.post<AvatarPresetDto>('', request);
  }

  async deleteAvatarPreset(id: string): Promise<void> {
    return this.deleteRequest<void>(`/${id}`);
  }
}
