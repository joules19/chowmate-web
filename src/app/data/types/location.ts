export enum LocationConfidenceLevel {
    Unknown = 'Unknown',
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}
export interface Zone {
    id?: string; // Unique identifier
    zoneName?: string; // "Mowe Central", "Redemption Camp"
    zoneCode?: string; // "MW01", "RC01"
    description?: string;
    isActive?: boolean;

    // Zone boundaries (bounding box)
    northEastLat?: number;
    northEastLng?: number;
    southWestLat?: number;
    southWestLng?: number;

    // Center point for calculations
    centerLatitude?: number;
    centerLongitude?: number;

    // Zone-specific settings
    baseDeliveryFee?: number;
    baseServiceFee?: number;

    averageDeliveryTime?: string; // ISO 8601 duration format
    maxDeliveryRadiusKm?: number;
    requiresLocationCall?: boolean;

    // Operational settings
    maxConcurrentOrders?: number;
    requiresMinimumOrder?: boolean;
    minimumOrderAmount?: number;

    // Additional properties
    dataSource?: string; // Corresponds to LocationDataSource in C#
    lastUpdated?: string; // ISO 8601 format for DateTime
}
