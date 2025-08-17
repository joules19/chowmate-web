import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { AuthService } from '../auth/auth-service';

// Base API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://chowmate-db2u.onrender.com';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests if available
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.response?.status} ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, error.response?.data);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Avoid infinite loop by checking if this is already a retry
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh the token
          const refreshSuccess = await AuthService.refreshToken();

          if (refreshSuccess) {
            // Retry the original request with the new token
            const newToken = AuthService.getToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }

      // If refresh failed or this is a retry, logout user
      AuthService.logout();

      // Redirect to login page if we're in the browser
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        // Don't redirect if already on login page
        if (!currentPath.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    // Handle other error status codes
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }

    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error - please try again later');
    }

    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  errors: any;
}

// API client instance
export default apiClient;

// Helper function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  const { data } = response;

  if (data.statusCode !== 200) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data;
};

// Helper function for making API requests with error handling
export const apiRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> => {
  try {
    const response = await requestFn();
    return handleApiResponse(response);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw error;
  }
};