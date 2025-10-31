export interface AdminSendOtpRequest extends Record<string, unknown> {
  contactInfo: string;
  isEmail: boolean;
  reason: string;
}

export interface AdminSendOtpResponse {
  message: string;
  success: boolean;
}

export interface VerifyOtpRequest extends Record<string, unknown> {
  contactInfo: string;
  otp: string;
  isEmail: boolean;
}

export interface VerifyOtpResponse {
  message: string;
  success: boolean;
  token?: string;
}

export enum OtpReason {
  PASSWORD_RESET = 'Password Reset',
  ACCOUNT_VERIFICATION = 'Account Verification',
  TWO_FACTOR_AUTH = '2FA Verification',
  ADMIN_ACTION = 'Administrative Action'
}

export interface OtpSession {
  contactInfo: string;
  isEmail: boolean;
  reason: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}