import {
    Customer,
    CustomerSummary,
    CustomerFilters,
    CustomerOrderHistory,
    CustomerStats,
    SuspendCustomerRequest,
    UpdateCustomerStatusRequest,
    CustomerActionRequest,
    GrantDeliveryCreditsRequest,
    GrantDeliveryCreditsResult,
    RevokeDeliveryCreditsRequest,
    RevokeDeliveryCreditsResult,
} from '@/app/data/types/customer';
import { BaseRepository } from '../base-repository';
import { PaginatedResponse } from '@/app/data/types/api';

// Define customer order filters interface
interface CustomerOrderFilters {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
}

// Define activity log type for better type safety
interface CustomerActivityLog {
    id: string;
    customerId: string;
    action: string;
    description: string;
    performedBy: string;
    performedAt: string;
    metadata?: Record<string, unknown>;
}

export class CustomerRepository extends BaseRepository<Customer> {
    constructor() {
        super('api/admin/customers');
    }

    async getAllCustomers(filters?: CustomerFilters): Promise<PaginatedResponse<CustomerSummary>> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const endpoint = queryParams.toString() ? `?${queryParams}` : '';
        return this.get<PaginatedResponse<CustomerSummary>>(endpoint);
    }

    async getCustomerById(customerId: string): Promise<Customer> {
        return this.get<Customer>(`/${customerId}`);
    }

    async getCustomerOrders(
        customerId: string,
        filters?: CustomerOrderFilters
    ): Promise<PaginatedResponse<CustomerOrderHistory>> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const endpoint = `/${customerId}/orders${queryParams.toString() ? `?${queryParams}` : ''}`;
        return this.get<PaginatedResponse<CustomerOrderHistory>>(endpoint);
    }

    async suspendCustomer(customerId: string, request: SuspendCustomerRequest): Promise<Customer> {
        return this.put<Customer>(`/${customerId}/suspend`, request);
    }

    async activateCustomer(customerId: string, request?: CustomerActionRequest): Promise<Customer> {
        return this.put<Customer>(`/${customerId}/activate`, request || {});
    }

    async updateCustomerStatus(customerId: string, request: UpdateCustomerStatusRequest): Promise<Customer> {
        return this.put<Customer>(`/${customerId}/status`, request);
    }

    async deleteCustomer(customerId: string): Promise<boolean> {
        await this.deleteRequest<void>(`/${customerId}`);
        return true;
    }

    async getCustomerStats(dateFrom?: string, dateTo?: string): Promise<CustomerStats> {
        const queryParams = new URLSearchParams();

        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);

        const endpoint = `/stats${queryParams.toString() ? `?${queryParams}` : ''}`;
        return this.get<CustomerStats>(endpoint);
    }

    async getCustomerActivities(customerId: string, limit: number = 20): Promise<CustomerActivityLog[]> {
        return this.get<CustomerActivityLog[]>(`/${customerId}/activities?limit=${limit}`);
    }

    async grantDeliveryCredits(request: GrantDeliveryCreditsRequest): Promise<GrantDeliveryCreditsResult> {
        return this.post<GrantDeliveryCreditsResult>('/delivery-credits', request as unknown as Record<string, unknown>);
    }

    async revokeDeliveryCredits(request: RevokeDeliveryCreditsRequest): Promise<RevokeDeliveryCreditsResult> {
        return this.deleteRequest<RevokeDeliveryCreditsResult>('/delivery-credits', request as unknown as Record<string, unknown>);
    }

    // Convenience methods for common actions
    async banCustomer(customerId: string, reason: string, notifyCustomer: boolean = true): Promise<Customer> {
        return this.updateCustomerStatus(customerId, {
            status: 'Banned',
            reason,
            notifyCustomer
        });
    }

    async makeCustomerInactive(customerId: string, reason?: string, notifyCustomer: boolean = true): Promise<Customer> {
        return this.updateCustomerStatus(customerId, {
            status: 'Inactive',
            reason,
            notifyCustomer
        });
    }

    // Additional convenience methods for bulk operations
    async bulkSuspend(customerIds: string[], reason: string): Promise<void> {
        return this.bulkAction('suspend', customerIds, { reason });
    }

    async bulkActivate(customerIds: string[], reason?: string): Promise<void> {
        return this.bulkAction('activate', customerIds, { reason });
    }

    async bulkDelete(customerIds: string[], reason?: string): Promise<void> {
        return this.bulkAction('delete', customerIds, { reason });
    }
}