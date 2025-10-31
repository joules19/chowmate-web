import { BaseRepository } from '../base-repository';
import { 
  AdminSendOtpRequest, 
  AdminSendOtpResponse, 
  VerifyOtpRequest, 
  VerifyOtpResponse 
} from '../../../data/types/otp';

export class OtpService extends BaseRepository<any> {
  constructor() {
    super('/api/admin/users');
  }

  /**
   * Send OTP to a user (admin initiated)
   * @param request The OTP send request details
   * @returns Promise with the send operation result
   */
  async sendOtpToUser(request: AdminSendOtpRequest): Promise<AdminSendOtpResponse> {
    return this.post<AdminSendOtpResponse>('/send-otp', request);
  }

  /**
   * Verify OTP code
   * @param request The OTP verification request
   * @returns Promise with the verification result
   */
  async verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return this.post<VerifyOtpResponse>('/verify-otp', request);
  }

  /**
   * Resend OTP to a user
   * @param contactInfo The user's email or phone number
   * @param isEmail Whether the contact info is an email address
   * @returns Promise with the resend operation result
   */
  async resendOtp(contactInfo: string, isEmail: boolean): Promise<AdminSendOtpResponse> {
    return this.post<AdminSendOtpResponse>('/resend-otp', {
      contactInfo,
      isEmail
    });
  }
}

export const otpService = new OtpService();