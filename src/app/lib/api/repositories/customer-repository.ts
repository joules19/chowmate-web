import {
    Customer,
    CustomerSummary,
    CustomerFilters,
    CustomerOrderHistory,
    CustomerStats,
    SuspendCustomerRequest,
    UpdateCustomerStatusRequest,
    DeleteCustomerRequest,
    CustomerActionRequest
} from '@/app/data/types/customer';
import { BaseRepository } from '../base-repository';
import { PaginatedResponse } from '@/app/data/types/api';

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
        filters?: {
            status?: string;
            dateFrom?: string;
            dateTo?: string;
            pageNumber?: number;
            pageSize?: number;
            sortBy?: string;
            sortOrder?: string;
        }
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

    async deleteCustomer(customerId: string, request: DeleteCustomerRequest): Promise<boolean> {
        await this.delete(`/${customerId}`);
        return true;
    }

    async getCustomerStats(dateFrom?: string, dateTo?: string): Promise<CustomerStats> {
        const queryParams = new URLSearchParams();

        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);

        const endpoint = `/stats${queryParams.toString() ? `?${queryParams}` : ''}`;
        return this.get<CustomerStats>(endpoint);
    }

    async getCustomerActivities(customerId: string, limit: number = 20): Promise<any[]> {
        return this.get<any[]>(`/${customerId}/activities?limit=${limit}`);
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
}