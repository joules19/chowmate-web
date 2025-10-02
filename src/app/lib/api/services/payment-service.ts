import { BaseRepository } from '../base-repository';
import apiClient from '../axios-config';
import {
    InitializeTransactionResponse,
    WalletFundingRequest,
    WalletTransaction,
    InitializeWalletFundingDto,
    VerifyWalletFundingForWebDto,
    WalletFundingResponse,
    WalletTransactionDto,
    WalletTransactionType,
    PaginatedResult,
    ApiResponse
} from '../../../data/types/payment';

export class PaymentService extends BaseRepository<WalletTransaction> {
    constructor() {
        super('/api/payment');
    }

    async initializeTransaction(request: Record<string, unknown>): Promise<InitializeTransactionResponse> {
        return this.post<InitializeTransactionResponse>('/initialize', request);
    }

    async verifyWalletFundingForWeb(reference: string, userId: string): Promise<WalletFundingResponse> {
        try {
            const verifyRequest: VerifyWalletFundingForWebDto = {
                reference,
                userId
            };
            
            // Make the raw API call to get the full response structure
            const response = await apiClient.post(`${this.endpoint}/verify-wallet-funding-web`, verifyRequest);
            
            // Return the full response data which matches your backend structure
            return response.data;
        } catch (error) {
            console.error('Verification API Error:', error);
            throw error;
        }
    }

    async fundWallet(request: WalletFundingRequest): Promise<InitializeTransactionResponse> {
        const walletFundingRequest: InitializeWalletFundingDto = {
            email: request.email,
            amount: request.amount, // Keep as original amount (not in kobo)
            userId: request.userId
        };

        return this.post<InitializeTransactionResponse>('/initialize-wallet-funding', walletFundingRequest);
    }

    async getWalletTransactions(walletId: string): Promise<WalletTransaction[]> {
        return this.get<WalletTransaction[]>(`/wallet/${walletId}/transactions`);
    }

    async getUserWalletTransactions(userId: string): Promise<WalletTransaction[]> {
        return this.get<WalletTransaction[]>(`/user/${userId}/wallet/transactions`);
    }

    async getAllWalletTransactions(
        pageNumber: number = 1,
        pageSize: number = 20,
        transactionType?: WalletTransactionType
    ): Promise<ApiResponse<PaginatedResult<WalletTransactionDto>>> {
        const params = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString()
        });
        
        if (transactionType) {
            params.append('transactionType', transactionType);
        }

        const response = await apiClient.get(`${this.endpoint}/wallet-transactions/all?${params.toString()}`);
        return response.data;
    }

    async getWalletTransactionsByUserId(
        userId: string,
        pageNumber: number = 1,
        pageSize: number = 20,
        transactionType?: WalletTransactionType
    ): Promise<ApiResponse<PaginatedResult<WalletTransactionDto>>> {
        const params = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString()
        });
        
        if (transactionType) {
            params.append('transactionType', transactionType);
        }

        const response = await apiClient.get(`${this.endpoint}/wallet-transactions/user/${userId}?${params.toString()}`);
        return response.data;
    }
}

export const paymentService = new PaymentService();