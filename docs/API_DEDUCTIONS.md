# Vendor Deductions API Documentation

**Version:** 1.0
**Base URL:** `https://api.chowmate.com`
**Last Updated:** December 31, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Vendor Endpoints](#vendor-endpoints)
4. [Admin Endpoints](#admin-endpoints)
5. [Data Models](#data-models)
6. [Status Codes & Error Handling](#status-codes--error-handling)
7. [Business Rules](#business-rules)
8. [Webhooks & Notifications](#webhooks--notifications)

---

## Overview

The Deductions API allows vendors to view and dispute deductions from their earnings, while enabling admins to create and manage deductions with a 48-hour grace period before automatic charging.

### Key Features

- **48-Hour Grace Period**: Deductions become chargeable 48 hours after creation
- **Automatic Charging**: Deductions are automatically charged from vendor earnings (order completion or scheduled processing every 6 hours)
- **Dispute Mechanism**: Vendors can dispute deductions before or after payment
- **Automatic Refunds**: Approved disputes on paid deductions trigger automatic wallet refunds
- **Priority-Based Processing**: Deductions charged in order: Critical → High → Medium → Low
- **All-or-Nothing**: Only charges when full amount is available (no partial payments)

---

## Authentication

All endpoints require JWT Bearer token authentication.

### Headers

```http
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

### Role Requirements

- **Vendor Endpoints**: Require `Vendor` role
- **Admin Endpoints**: Require `VendorManagement.View` or `VendorManagement.Manage` policy

---

## Vendor Endpoints

### 1. Get My Deductions

Retrieve paginated list of deductions for the authenticated vendor.

**Endpoint:** `GET /api/vendor/deductions`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | No | - | Filter by status: `Pending`, `PartiallyPaid`, `FullyPaid`, `Disputed`, `Cancelled`, `Expired` |
| `pageNumber` | integer | No | 1 | Page number (1-based) |
| `pageSize` | integer | No | 20 | Items per page (max 100) |
| `sortBy` | string | No | `CreatedAt` | Sort field: `CreatedAt`, `Amount`, `Priority` |
| `sortOrder` | string | No | `desc` | Sort direction: `asc` or `desc` |

**Request Example:**

```http
GET /api/vendor/deductions?status=Pending&pageNumber=1&pageSize=20&sortBy=CreatedAt&sortOrder=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "succeeded": true,
  "message": "Deductions retrieved successfully",
  "data": {
    "items": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "vendorId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "vendorBusinessName": "Joe's Pizza",
        "amount": 50.00,
        "outstandingAmount": 50.00,
        "paidAmount": 0.00,
        "description": "Damaged packaging on Order #12345",
        "reason": "Customer complaint - damaged items",
        "referenceNumber": "DED_a1b2c3d4e5f6g7h8i9j0",
        "status": "Pending",
        "statusDisplay": "Pending",
        "priority": "Medium",
        "priorityDisplay": "Medium",
        "priorityOrder": 0,
        "createdAt": "2025-12-29T10:00:00Z",
        "chargeableAfter": "2025-12-31T10:00:00Z",
        "isInGracePeriod": true,
        "hoursUntilChargeable": 47.5,
        "isChargeable": false,
        "fullyPaidAt": null,
        "expiresAt": "2026-01-29T10:00:00Z",
        "isDisputed": false,
        "disputeStatus": null,
        "disputeStatusDisplay": null,
        "disputedAt": null,
        "createdByAdminName": "System Admin"
      }
    ],
    "totalCount": 1,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 1
  },
  "statusCode": 200
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Not a vendor

---

### 2. Get Deduction Details

Get detailed information about a specific deduction including payment history.

**Endpoint:** `GET /api/vendor/deductions/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | guid | Yes | Deduction ID |

**Request Example:**

```http
GET /api/vendor/deductions/3fa85f64-5717-4562-b3fc-2c963f66afa6
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "succeeded": true,
  "message": "Deduction details retrieved successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "vendorId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "vendorBusinessName": "Joe's Pizza",
    "amount": 50.00,
    "outstandingAmount": 0.00,
    "paidAmount": 50.00,
    "description": "Damaged packaging on Order #12345",
    "reason": "Customer complaint - damaged items",
    "referenceNumber": "DED_a1b2c3d4e5f6g7h8i9j0",
    "status": "FullyPaid",
    "priority": "Medium",
    "priorityOrder": 0,
    "createdAt": "2025-12-29T10:00:00Z",
    "chargeableAfter": "2025-12-31T10:00:00Z",
    "fullyPaidAt": "2025-12-31T15:30:00Z",
    "expiresAt": "2026-01-29T10:00:00Z",
    "isDisputed": false,
    "disputeStatus": null,
    "disputedAt": null,
    "notes": null,
    "disputeReason": null,
    "disputeResolutionNotes": null,
    "disputeReviewedAt": null,
    "cancellationReason": null,
    "cancelledAt": null,
    "payments": [
      {
        "id": "8e296a07-e3d9-4987-9da9-7c24e0b1f3f4",
        "amount": 50.00,
        "reference": "DEDPAY_xyz123abc456",
        "source": "OrderEarnings",
        "createdAt": "2025-12-31T15:30:00Z",
        "sourceOrderId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "sourceOrderNumber": null
      }
    ],
    "createdByAdminName": "System Admin"
  },
  "statusCode": 200
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Deduction not found
- `403 Forbidden` - Not authorized to view this deduction
- `401 Unauthorized` - Missing or invalid token

---

### 3. Submit Dispute

Submit a dispute for a deduction. Can be done before or after the deduction is paid.

**Endpoint:** `POST /api/vendor/deductions/{id}/dispute`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | guid | Yes | Deduction ID |

**Request Body:**

```json
{
  "disputeReason": "This damage was not caused by us. Customer confirmed delivery was perfect and we have photos proving good condition at time of handover."
}
```

**Request Schema:**

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `disputeReason` | string | Yes | - | Detailed reason for disputing the deduction |

**Request Example:**

```http
POST /api/vendor/deductions/3fa85f64-5717-4562-b3fc-2c963f66afa6/dispute
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "disputeReason": "Customer confirmed no damage on delivery. Have photo evidence."
}
```

**Response (200 OK):**

```json
{
  "succeeded": true,
  "message": "Dispute submitted successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "vendorId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "amount": 50.00,
    "outstandingAmount": 50.00,
    "status": "Disputed",
    "isDisputed": true,
    "disputeStatus": "Pending",
    "disputedAt": "2025-12-30T14:20:00Z",
    "chargeableAfter": "2025-12-31T10:00:00Z",
    "isInGracePeriod": true,
    "hoursUntilChargeable": 19.5
  },
  "statusCode": 200
}
```

**Status Codes:**
- `200 OK` - Dispute submitted successfully
- `400 Bad Request` - Invalid request (missing reason, already disputed, cancelled)
- `404 Not Found` - Deduction not found
- `403 Forbidden` - Not authorized
- `401 Unauthorized` - Missing or invalid token

**Business Rules:**
- ✅ Can dispute deductions with status: `Pending`, `PartiallyPaid`, or `FullyPaid`
- ✅ Can dispute even after payment (will get refund if approved)
- ❌ Cannot dispute already disputed deductions
- ❌ Cannot dispute cancelled deductions
- ⏸️ Disputing a `Pending` or `PartiallyPaid` deduction stops auto-charging
- 💰 Disputing a `FullyPaid` deduction keeps status as paid until admin reviews

---

### 4. Get Deduction Summary

Get summary statistics and recent deductions for the authenticated vendor.

**Endpoint:** `GET /api/vendor/deductions/summary`

**Request Example:**

```http
GET /api/vendor/deductions/summary
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "succeeded": true,
  "message": "Summary retrieved successfully",
  "data": {
    "totalOutstanding": 125.50,
    "totalPaid": 450.00,
    "pendingCount": 3,
    "disputedCount": 1,
    "recentDeductions": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "amount": 50.00,
        "outstandingAmount": 50.00,
        "description": "Damaged packaging",
        "status": "Pending",
        "priority": "Medium",
        "createdAt": "2025-12-29T10:00:00Z",
        "chargeableAfter": "2025-12-31T10:00:00Z",
        "isInGracePeriod": true,
        "hoursUntilChargeable": 47.5
      }
    ]
  },
  "statusCode": 200
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Not a vendor

---

## Admin Endpoints

### 1. Create Deduction

Create a new deduction for a vendor. Deduction will be chargeable after 48 hours.

**Endpoint:** `POST /api/admin/deductions`

**Authorization:** Requires `VendorManagement.Manage` policy

**Request Body:**

```json
{
  "vendorId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "amount": 50.00,
  "description": "Damaged packaging on Order #12345",
  "reason": "Customer complaint - 3 items arrived damaged",
  "priority": "Medium",
  "priorityOrder": 0,
  "expiresAt": "2026-01-29T10:00:00Z",
  "notes": "Customer has photos. Vendor was notified on 2025-12-28.",
  "adminUserId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "adminUserName": "Admin User"
}
```

**Request Schema:**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `vendorId` | guid | Yes | Target vendor ID | Must be valid vendor |
| `amount` | decimal | Yes | Deduction amount | Must be > 0 |
| `description` | string | Yes | Brief description | Required |
| `reason` | string | Yes | Detailed reason | Required |
| `priority` | string | No | Priority level | `Critical`, `High`, `Medium`, `Low` (default: `Medium`) |
| `priorityOrder` | integer | No | Manual ordering within priority | Default: 0 |
| `expiresAt` | datetime | No | Expiration date | Optional |
| `notes` | string | No | Admin notes (hidden from vendor) | Optional |
| `adminUserId` | string | Yes | Admin user ID | Required |
| `adminUserName` | string | Yes | Admin display name | Required |

**Response (200 OK):**

```json
{
  "succeeded": true,
  "message": "Deduction created successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "vendorId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "vendorBusinessName": "Joe's Pizza",
    "amount": 50.00,
    "outstandingAmount": 50.00,
    "description": "Damaged packaging on Order #12345",
    "reason": "Customer complaint - 3 items arrived damaged",
    "referenceNumber": "DED_a1b2c3d4e5f6g7h8i9j0",
    "status": "Pending",
    "priority": "Medium",
    "priorityOrder": 0,
    "createdAt": "2025-12-29T10:00:00Z",
    "chargeableAfter": "2025-12-31T10:00:00Z",
    "expiresAt": "2026-01-29T10:00:00Z",
    "isDisputed": false,
    "createdByAdminName": "Admin User"
  },
  "statusCode": 200
}
```

**Status Codes:**
- `200 OK` - Deduction created successfully
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions

---

### 2. List All Deductions

Get paginated list of all deductions with filtering options.

**Endpoint:** `GET /api/admin/deductions`

**Authorization:** Requires `VendorManagement.View` policy

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `vendorId` | guid | No | - | Filter by vendor |
| `status` | string | No | - | Filter by status |
| `priority` | string | No | - | Filter by priority |
| `pageNumber` | integer | No | 1 | Page number |
| `pageSize` | integer | No | 20 | Items per page (max 100) |
| `sortBy` | string | No | `CreatedAt` | Sort field |
| `sortOrder` | string | No | `desc` | Sort direction |

**Request Example:**

```http
GET /api/admin/deductions?vendorId=7c9e6679-7425-40de-944b-e07fc1f90ae7&status=Pending&pageNumber=1&pageSize=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** Same structure as vendor's "Get My Deductions" endpoint.

---

### 3. Get Deduction by ID

Get detailed information about a specific deduction (admin view includes admin notes).

**Endpoint:** `GET /api/admin/deductions/{id}`

**Authorization:** Requires `VendorManagement.View` policy

**Response:** Same as vendor details endpoint but includes admin `notes` field.

---

### 4. Update Deduction

Update deduction details (only for pending deductions).

**Endpoint:** `PUT /api/admin/deductions/{id}`

**Authorization:** Requires `VendorManagement.Manage` policy

**Request Body:**

```json
{
  "description": "Updated description",
  "priority": "High",
  "priorityOrder": 1,
  "expiresAt": "2026-02-28T00:00:00Z",
  "notes": "Updated admin notes",
  "adminUserId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "adminUserName": "Admin User"
}
```

**Request Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `deductionId` | guid | Yes (path) | Deduction ID |
| `description` | string | No | Updated description |
| `priority` | string | No | Updated priority |
| `priorityOrder` | integer | No | Updated order |
| `expiresAt` | datetime | No | Updated expiration |
| `notes` | string | No | Updated admin notes |
| `adminUserId` | string | Yes | Admin user ID |
| `adminUserName` | string | Yes | Admin display name |

**Response (200 OK):**

```json
{
  "succeeded": true,
  "message": "Deduction updated successfully",
  "data": { /* Updated deduction object */ },
  "statusCode": 200
}
```

**Status Codes:**
- `200 OK` - Updated successfully
- `400 Bad Request` - Cannot update (not pending, already paid, etc.)
- `404 Not Found` - Deduction not found
- `403 Forbidden` - Insufficient permissions

---

### 5. Cancel Deduction

Cancel a deduction (cannot be undone).

**Endpoint:** `DELETE /api/admin/deductions/{id}`

**Authorization:** Requires `VendorManagement.Manage` policy

**Request Body:**

```json
{
  "cancellationReason": "Vendor provided proof of proper packaging. Our investigation confirmed vendor was not at fault.",
  "adminUserId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "adminUserName": "Admin User"
}
```

**Response (200 OK):**

```json
{
  "succeeded": true,
  "message": "Deduction cancelled successfully",
  "data": true,
  "statusCode": 200
}
```

**Status Codes:**
- `200 OK` - Cancelled successfully
- `400 Bad Request` - Cannot cancel (already fully paid)
- `404 Not Found` - Deduction not found
- `403 Forbidden` - Insufficient permissions

---

### 6. List Disputed Deductions

Get all deductions with pending disputes.

**Endpoint:** `GET /api/admin/deductions/disputes`

**Authorization:** Requires `VendorManagement.View` policy

**Query Parameters:** Same as "List All Deductions"

**Response:** Returns deductions where `isDisputed = true` and `disputeStatus = "Pending"` or `"UnderReview"`.

---

### 7. Review Dispute

Approve or reject a vendor's dispute.

**Endpoint:** `POST /api/admin/deductions/{id}/review-dispute`

**Authorization:** Requires `VendorManagement.Manage` policy

**Request Body:**

```json
{
  "approve": true,
  "resolutionNotes": "Reviewed delivery photos and customer statement. Vendor is correct - damage occurred after delivery. Approving dispute and issuing refund.",
  "adminUserId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "adminUserName": "Admin User"
}
```

**Request Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `approve` | boolean | Yes | `true` to approve (cancel & refund), `false` to reject |
| `resolutionNotes` | string | Yes | Explanation of decision |
| `adminUserId` | string | Yes | Admin user ID |
| `adminUserName` | string | Yes | Admin display name |

**Response (200 OK):**

```json
{
  "succeeded": true,
  "message": "Dispute approved successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "status": "Cancelled",
    "isDisputed": true,
    "disputeStatus": "Approved",
    "disputeResolutionNotes": "Reviewed delivery photos...",
    "disputeReviewedAt": "2025-12-30T16:00:00Z",
    "cancelledAt": "2025-12-30T16:00:00Z"
  },
  "statusCode": 200
}
```

**Behavior:**

**If `approve = true` (Approve Dispute):**
1. Sets `disputeStatus` to `Approved`
2. Sets `status` to `Cancelled`
3. If deduction was `FullyPaid`:
   - ✅ **Automatically issues refund** to vendor wallet
   - Creates `WalletTransaction` (Credit)
   - Updates vendor balance
   - Full audit trail in metadata

**If `approve = false` (Reject Dispute):**
1. Sets `disputeStatus` to `Rejected`
2. Sets `isDisputed` to `false`
3. If deduction was `Pending`: Returns to `Pending` (will be charged)
4. If deduction was `FullyPaid`: Stays `FullyPaid` (money remains deducted)

**Status Codes:**
- `200 OK` - Dispute reviewed successfully
- `400 Bad Request` - Not disputed, missing notes
- `404 Not Found` - Deduction not found
- `403 Forbidden` - Insufficient permissions

---

## Data Models

### DeductionDto

```typescript
interface DeductionDto {
  id: string;                          // UUID
  vendorId: string;                    // UUID
  vendorBusinessName: string;          // Vendor's business name
  amount: number;                      // Original deduction amount
  outstandingAmount: number;           // Remaining unpaid amount
  paidAmount: number;                  // Calculated: amount - outstandingAmount
  description: string;                 // Brief description
  reason: string;                      // Detailed reason
  referenceNumber: string;             // e.g., "DED_a1b2c3d4..."
  status: DeductionStatus;             // See enum below
  statusDisplay: string;               // Human-readable status
  priority: DeductionPriority;         // See enum below
  priorityDisplay: string;             // Human-readable priority
  priorityOrder: number;               // Manual ordering (0-n)
  createdAt: string;                   // ISO 8601 datetime
  chargeableAfter: string;             // ISO 8601 datetime (48 hours after creation)
  isInGracePeriod: boolean;            // Calculated: Now < chargeableAfter
  hoursUntilChargeable: number;        // Calculated: Hours remaining in grace period
  isChargeable: boolean;               // Calculated: Can be charged now
  fullyPaidAt: string | null;          // ISO 8601 datetime when fully paid
  expiresAt: string | null;            // ISO 8601 datetime (optional expiration)
  isDisputed: boolean;                 // Has active dispute
  disputeStatus: DisputeStatus | null; // See enum below
  disputeStatusDisplay: string | null; // Human-readable dispute status
  disputedAt: string | null;           // ISO 8601 datetime when disputed
  createdByAdminName: string;          // Admin who created it
}
```

### DeductionDetailsDto

```typescript
interface DeductionDetailsDto extends DeductionDto {
  notes: string | null;                      // Admin notes (only in admin responses)
  disputeReason: string | null;              // Vendor's dispute reason
  disputeResolutionNotes: string | null;     // Admin's resolution notes
  disputeReviewedAt: string | null;          // ISO 8601 datetime
  cancellationReason: string | null;         // Why it was cancelled
  cancelledAt: string | null;                // ISO 8601 datetime
  payments: DeductionPaymentHistoryDto[];    // Payment history
}
```

### DeductionPaymentHistoryDto

```typescript
interface DeductionPaymentHistoryDto {
  id: string;                          // UUID
  amount: number;                      // Payment amount
  reference: string;                   // e.g., "DEDPAY_xyz123..."
  source: DeductionPaymentSource;      // See enum below
  createdAt: string;                   // ISO 8601 datetime
  sourceOrderId: string | null;        // UUID of order (if from order earnings)
  sourceOrderNumber: string | null;    // Order number for display
}
```

### DeductionSummaryDto

```typescript
interface DeductionSummaryDto {
  totalOutstanding: number;            // Sum of all outstanding amounts
  totalPaid: number;                   // Sum of all paid amounts
  pendingCount: number;                // Count of Pending/PartiallyPaid deductions
  disputedCount: number;               // Count of disputed deductions
  recentDeductions: DeductionDto[];    // Last 5 deductions
}
```

### Enums

```typescript
enum DeductionStatus {
  Pending = "Pending",               // 0 - Awaiting payment
  PartiallyPaid = "PartiallyPaid",   // 1 - Partially paid (not used in all-or-nothing)
  FullyPaid = "FullyPaid",           // 2 - Fully paid
  Disputed = "Disputed",             // 3 - Under dispute (charging paused)
  Cancelled = "Cancelled",           // 4 - Cancelled by admin
  Expired = "Expired"                // 5 - Expired without payment
}

enum DeductionPriority {
  Critical = "Critical",             // 0 - Charged first
  High = "High",                     // 1 - Charged second
  Medium = "Medium",                 // 2 - Charged third (default)
  Low = "Low"                        // 3 - Charged last
}

enum DisputeStatus {
  Pending = "Pending",               // 0 - Awaiting admin review
  UnderReview = "UnderReview",       // 1 - Admin is reviewing
  Approved = "Approved",             // 2 - Dispute approved (refunded if paid)
  Rejected = "Rejected"              // 3 - Dispute rejected
}

enum DeductionPaymentSource {
  OrderEarnings = "OrderEarnings",   // 0 - Charged from order completion
  ManualCharge = "ManualCharge",     // 1 - Manual admin charge
  WalletCredit = "WalletCredit"      // 2 - Charged from scheduled processing
}
```

---

## Status Codes & Error Handling

### Success Responses

| Code | Description |
|------|-------------|
| `200 OK` | Request succeeded |

### Error Responses

| Code | Description | Example |
|------|-------------|---------|
| `400 Bad Request` | Invalid request parameters | Missing required fields, invalid status |
| `401 Unauthorized` | Missing or invalid authentication token | Token expired, not provided |
| `403 Forbidden` | User lacks required permissions | Not a vendor, missing policy |
| `404 Not Found` | Resource not found | Deduction ID doesn't exist |
| `500 Internal Server Error` | Server error | Database connection failed |

### Error Response Format

```json
{
  "succeeded": false,
  "message": "Deduction not found",
  "data": null,
  "statusCode": 404
}
```

### Common Error Messages

```json
{
  "succeeded": false,
  "message": "Vendor not found",
  "statusCode": 400
}

{
  "succeeded": false,
  "message": "Cannot dispute a fully paid deduction",
  "statusCode": 400
}

{
  "succeeded": false,
  "message": "Deduction is already disputed",
  "statusCode": 400
}

{
  "succeeded": false,
  "message": "Dispute reason is required",
  "statusCode": 400
}

{
  "succeeded": false,
  "message": "Deduction not found",
  "statusCode": 404
}

{
  "succeeded": false,
  "message": "Unauthorized",
  "statusCode": 403
}
```

---

## Business Rules

### 48-Hour Grace Period

1. **Creation**: All deductions are created with `chargeableAfter` = `now + 48 hours`
2. **Display**: Frontend should show countdown timer using `hoursUntilChargeable`
3. **Protection**: Deductions are **never** charged during grace period
4. **Purpose**: Gives vendors time to review and dispute before payment

**UI Recommendations:**

```javascript
if (deduction.isInGracePeriod) {
  // Show: "⏰ Chargeable in 47 hours"
  showCountdown(deduction.hoursUntilChargeable);
  enableDisputeButton();
} else if (deduction.isChargeable) {
  // Show: "⚠️ Will be charged from next earnings"
  showActiveWarning();
  enableDisputeButton();
}
```

### Charging Mechanism

**Deductions are charged in two ways:**

1. **Event-Driven (Primary):**
   - When vendor completes an order
   - Earnings distributed → Deductions processed immediately
   - Fast, handles 90%+ of cases

2. **Scheduled Batch (Safety Net):**
   - Runs every 6 hours (4 times daily)
   - Processes vendors with wallet balance > 0
   - Catches inactive vendors

**Processing Order:**
```
Priority: Critical → High → Medium → Low
  Then: PriorityOrder (0, 1, 2...)
    Then: CreatedAt (oldest first)
```

**All-or-Nothing Rule:**
- ✅ Only charges if **full amount** is available
- ❌ Never does partial payments
- If balance insufficient, skips to next deduction

**Example:**
```
Vendor Balance: $100
Deductions:
  1. Critical: $150 → SKIPPED (insufficient)
  2. High: $30 → CHARGED ✅ (balance now $70)
  3. High: $80 → SKIPPED (insufficient)
  4. Medium: $50 → CHARGED ✅ (balance now $20)
```

### Dispute Workflow

**Vendor Can Dispute:**
- ✅ `Pending` deductions (before grace period ends)
- ✅ `Pending` deductions (after grace period, before charged)
- ✅ `PartiallyPaid` deductions
- ✅ `FullyPaid` deductions (post-payment disputes)
- ❌ Cannot dispute `Cancelled` or already disputed

**When Vendor Disputes:**

| Deduction Status | Dispute Action | Charging Behavior |
|-----------------|----------------|-------------------|
| `Pending` | Status → `Disputed`, `DisputeStatus` → `Pending` | ⏸️ Auto-charging **STOPS** |
| `PartiallyPaid` | Status → `Disputed`, `DisputeStatus` → `Pending` | ⏸️ Auto-charging **STOPS** |
| `FullyPaid` | Status stays `FullyPaid`, `DisputeStatus` → `Pending`, `IsDisputed` → `true` | 💰 Money already taken |

**When Admin Reviews:**

| Approve? | Was Paid? | Action |
|----------|-----------|--------|
| ✅ Yes | No | Cancel deduction, vendor never pays |
| ✅ Yes | Yes | Cancel deduction, **AUTOMATIC REFUND** to wallet |
| ❌ No | No | Return to `Pending`, will be charged next time |
| ❌ No | Yes | Keep `FullyPaid`, money stays deducted |

### Automatic Refunds

**When dispute is approved on a paid deduction:**

1. ✅ Creates `WalletTransaction` (Type: Credit)
2. ✅ Credits vendor wallet with full amount
3. ✅ Sets deduction status to `Cancelled`
4. ✅ Records admin, timestamp, resolution notes
5. ✅ Full audit trail in transaction metadata

**Refund Metadata Example:**
```json
{
  "deductionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "deductionReference": "DED_a1b2c3d4...",
  "refundReason": "Dispute Approved",
  "approvedBy": "Admin User",
  "approvedAt": "2025-12-30T16:00:00Z",
  "resolutionNotes": "Vendor provided proof..."
}
```

### Expiration

- If `expiresAt` is set and passes, deduction status → `Expired`
- Expired deductions are not charged
- This is a manual/optional feature

---

## Webhooks & Notifications

### Recommended Notification Events

Implement push notifications or webhooks for these events:

1. **Deduction Created**
   ```json
   {
     "event": "deduction.created",
     "vendorId": "...",
     "deductionId": "...",
     "amount": 50.00,
     "chargeableAfter": "2025-12-31T10:00:00Z",
     "description": "..."
   }
   ```

2. **Deduction Charged**
   ```json
   {
     "event": "deduction.charged",
     "vendorId": "...",
     "deductionId": "...",
     "amount": 50.00,
     "balanceAfter": 150.00
   }
   ```

3. **Dispute Status Updated**
   ```json
   {
     "event": "dispute.reviewed",
     "vendorId": "...",
     "deductionId": "...",
     "disputeStatus": "Approved",
     "refundIssued": true,
     "refundAmount": 50.00
   }
   ```

4. **Grace Period Ending (24h before)**
   ```json
   {
     "event": "deduction.grace_period_ending",
     "vendorId": "...",
     "deductionId": "...",
     "chargeableIn": "24 hours",
     "amount": 50.00
   }
   ```

---

## Integration Examples

### JavaScript/TypeScript

```typescript
// Fetch vendor's deductions
async function getMyDeductions(page = 1, status?: string) {
  const params = new URLSearchParams({
    pageNumber: page.toString(),
    pageSize: '20'
  });

  if (status) params.append('status', status);

  const response = await fetch(
    `https://api.chowmate.com/api/vendor/deductions?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const result = await response.json();

  if (!result.succeeded) {
    throw new Error(result.message);
  }

  return result.data;
}

// Submit a dispute
async function submitDispute(deductionId: string, reason: string) {
  const response = await fetch(
    `https://api.chowmate.com/api/vendor/deductions/${deductionId}/dispute`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        disputeReason: reason
      })
    }
  );

  const result = await response.json();

  if (!result.succeeded) {
    throw new Error(result.message);
  }

  return result.data;
}

// Admin: Create deduction
async function createDeduction(data: CreateDeductionRequest) {
  const response = await fetch(
    'https://api.chowmate.com/api/admin/deductions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!result.succeeded) {
    throw new Error(result.message);
  }

  return result.data;
}
```

### React Hook Example

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Hook to fetch deductions
export function useDeductions(status?: string, page = 1) {
  return useQuery({
    queryKey: ['deductions', status, page],
    queryFn: () => getMyDeductions(page, status)
  });
}

// Hook to submit dispute
export function useSubmitDispute() {
  return useMutation({
    mutationFn: ({ deductionId, reason }: { deductionId: string; reason: string }) =>
      submitDispute(deductionId, reason),
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['deductions'] });
    }
  });
}
```

### UI Component Example

```tsx
function DeductionCard({ deduction }: { deduction: DeductionDto }) {
  return (
    <div className="deduction-card">
      <div className="header">
        <h3>{deduction.description}</h3>
        <span className={`status ${deduction.status.toLowerCase()}`}>
          {deduction.statusDisplay}
        </span>
      </div>

      <div className="amount">
        <strong>${deduction.amount.toFixed(2)}</strong>
        {deduction.outstandingAmount > 0 && (
          <span className="outstanding">
            ${deduction.outstandingAmount.toFixed(2)} outstanding
          </span>
        )}
      </div>

      {/* Grace period indicator */}
      {deduction.isInGracePeriod && (
        <div className="grace-period">
          ⏰ Chargeable in {Math.ceil(deduction.hoursUntilChargeable)} hours
        </div>
      )}

      {/* Active warning */}
      {!deduction.isInGracePeriod && deduction.isChargeable && (
        <div className="active-warning">
          ⚠️ Will be charged from your next earnings
        </div>
      )}

      {/* Dispute status */}
      {deduction.isDisputed && (
        <div className="dispute-status">
          <span>🔔 Dispute Status:</span>
          <strong>{deduction.disputeStatusDisplay}</strong>
        </div>
      )}

      <p className="reason">{deduction.reason}</p>

      <div className="metadata">
        <span>Ref: {deduction.referenceNumber}</span>
        <span>Priority: {deduction.priorityDisplay}</span>
        <span>Created: {new Date(deduction.createdAt).toLocaleDateString()}</span>
      </div>

      {deduction.isChargeable && !deduction.isDisputed && (
        <button onClick={() => handleDispute(deduction.id)}>
          Dispute This Deduction
        </button>
      )}
    </div>
  );
}
```

---

## Testing Endpoints

### Test Credentials

Use your JWT token obtained from the login endpoint.

### Postman Collection

Import the following collection structure:

```
Chowmate API
└── Deductions
    ├── Vendor
    │   ├── Get My Deductions
    │   ├── Get Deduction Details
    │   ├── Submit Dispute
    │   └── Get Summary
    └── Admin
        ├── Create Deduction
        ├── List All Deductions
        ├── Get Deduction by ID
        ├── Update Deduction
        ├── Cancel Deduction
        ├── List Disputes
        └── Review Dispute
```

### Environment Variables

```
base_url = https://api.chowmate.com
vendor_token = {{your_vendor_jwt_token}}
admin_token = {{your_admin_jwt_token}}
vendor_id = {{test_vendor_id}}
deduction_id = {{test_deduction_id}}
```

---

## Support & Contact

For API support, please contact:
- **Email:** api-support@chowmate.com
- **Documentation:** https://docs.chowmate.com/api
- **Status Page:** https://status.chowmate.com

---

**Last Updated:** December 31, 2025
**Version:** 1.0
**Changelog:**
- v1.0 (2025-12-31): Initial release with 48-hour grace period and automatic refunds
