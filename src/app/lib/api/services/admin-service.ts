import { BaseRepository } from "../base-repository";
import { AddAdminRequest, ChangeAdminPasswordRequest, UserDto } from "../../hooks/api-hooks.ts/use-admin";

export class AdminService extends BaseRepository<any> {
  constructor() {
    super('/api/account/auth');
  }

  async addAdmin(request: AddAdminRequest): Promise<UserDto> {
    return this.post<UserDto>('/add-admin', request);
  }

  async changeAdminPassword(request: ChangeAdminPasswordRequest): Promise<void> {
    return this.post<void>('/admin-change-password', request);
  }
}