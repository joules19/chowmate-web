export interface InitializeTransactionDto {
    email: string;
    amount: number;
    paymentPurpose: PaymentPurpose;
    channels?: string[];
}

export interface InitializeTransactionResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

export interface VerifyTransactionResponse {
    status: boolean;
    message: string;
    data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        amount: number;
        message: string | null;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: {
            custom_fields: Array<{
                display_name: string;
                variable_name: string;
                value: string;
            }>;
        };
        log: {
            start_time: number;
            time_spent: number;
            attempts: number;
            errors: number;
            success: boolean;
            mobile: boolean;
            input: any[];
            history: Array<{
                type: string;
                message: string;
                time: number;
            }>;
        };
        fees: number;
        fees_split: any;
        authorization: {
            authorization_code: string;
            bin: string;
            last4: string;
            exp_month: string;
            exp_year: string;
            channel: string;
            card_type: string;
            bank: string;
            country_code: string;
            brand: string;
            reusable: boolean;
            signature: string;
            account_name: string | null;
        };
        customer: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            customer_code: string;
            phone: string;
            metadata: any;
            risk_action: string;
            international_format_phone: string | null;
        };
        plan: any;
        split: any;
        order_id: any;
        paidAt: string;
        createdAt: string;
        requested_amount: number;
        pos_transaction_data: any;
        source: any;
        fees_breakdown: any;
    };
}

export enum PaymentPurpose {
    Purchase = 'Purchase',
    WalletFunding = 'WalletFunding',
    Subscription = 'Subscription',
    Donation = 'Donation'
}

export interface WalletFundingRequest {
    userId: string;
    amount: number;
    email: string;
}

export interface InitializeWalletFundingDto extends Record<string, unknown> {
    email: string;
    amount: number;
    userId: string;
}

export interface VerifyWalletFundingForWebDto extends Record<string, unknown> {
    reference: string;
    userId: string;
}

export interface WalletFundingResultDto {
    transactionId: string;
    amountFunded: number;
    walletBalance: number;
    transactionDate: string;
    status: number; // 0=Pending, 1=Completed, 2=Failed, 3=Reversed
}

export interface WalletFundingResponse {
    statusCode: number;
    message: string;
    data: WalletFundingResultDto;
    errors: any;
    isSuccess: boolean;
}

export interface WalletTransaction {
    id: string;
    walletId: string;
    reference: string;
    status: WalletTransactionStatus;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export enum WalletTransactionStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Failed = 'Failed',
    Cancelled = 'Cancelled'
}

export interface PaystackConfig {
    publicKey: string;
    email: string;
    amount: number;
    reference: string;
    currency?: string;
    channels?: string[];
    onSuccess: (reference: any) => void;
    onClose: () => void;
}