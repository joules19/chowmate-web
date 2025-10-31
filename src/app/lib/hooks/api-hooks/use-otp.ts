import { useMutation, useQueryClient } from '@tanstack/react-query';
import { otpService } from '../../api/services/otp-service';
import { 
  AdminSendOtpRequest, 
  AdminSendOtpResponse, 
  VerifyOtpRequest, 
  VerifyOtpResponse 
} from '../../../data/types/otp';

/**
 * Hook for sending OTP to users (admin initiated)
 */
export function useSendOtpToUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: AdminSendOtpRequest): Promise<AdminSendOtpResponse> => 
      otpService.sendOtpToUser(request),
    onSuccess: () => {
      // Optionally invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ['otp-sessions'] });
    },
    onError: (error) => {
      console.error('Failed to send OTP:', error);
    }
  });
}

/**
 * Hook for verifying OTP codes
 */
export function useVerifyOtp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: VerifyOtpRequest): Promise<VerifyOtpResponse> => 
      otpService.verifyOtp(request),
    onSuccess: () => {
      // Optionally invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ['otp-sessions'] });
    },
    onError: (error) => {
      console.error('Failed to verify OTP:', error);
    }
  });
}

/**
 * Hook for resending OTP to users
 */
export function useResendOtp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contactInfo, isEmail }: { contactInfo: string; isEmail: boolean }): Promise<AdminSendOtpResponse> => 
      otpService.resendOtp(contactInfo, isEmail),
    onSuccess: () => {
      // Optionally invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ['otp-sessions'] });
    },
    onError: (error) => {
      console.error('Failed to resend OTP:', error);
    }
  });
}