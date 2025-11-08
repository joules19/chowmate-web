import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '../../api/services/admin-service';
import { userService, AdminCreateUserRequest } from '../../api/services/user-service';

const adminService = new AdminService();

export interface AddAdminRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  generatePassword: boolean;
  password?: string;
  [key: string]: unknown;
}

export interface ChangeAdminPasswordRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  [key: string]: unknown;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  roles: string[];
  permissions: string[];
}

export function useAddAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddAdminRequest): Promise<UserDto> => 
      adminService.addAdmin(request),
    onSuccess: () => {
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Failed to add admin:', error);
    },
  });
}

export function useChangeAdminPassword() {
  return useMutation({
    mutationFn: (request: ChangeAdminPasswordRequest): Promise<void> => 
      adminService.changeAdminPassword(request),
    onError: (error) => {
      console.error('Failed to change password:', error);
    },
  });
}

export function useAdminCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AdminCreateUserRequest): Promise<UserDto> => 
      userService.adminCreateUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
}