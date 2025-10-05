# Rider Backend API Implementation Requirements

## Overview
This document outlines the backend API requirements for implementing rider management functionality with enhanced status handling, including approve, reject, and send back to pending actions.

## Rider Status Management

### Status Enum Updates
Add the following statuses to the rider status enum:

```csharp
public enum RiderStatus 
{
    PendingVerification = 0,
    UnderReview = 1,
    Available = 2,
    Busy = 3,
    Offline = 4,
    OnBreak = 5,
    Suspended = 6,
    Rejected = 7
}
```

## API Endpoints

### 1. Approve Rider with Zone Assignment

**Endpoint:** `PUT /api/admin/riders/{riderId}/approve`

**Request Body:**
```json
{
  "notes": "string (optional)",
  "notifyRider": "boolean (default: true)",
  "zoneIds": ["string array (optional)"]
}
```

**Response (200 OK):**
```json
{
  "riderId": "string",
  "riderName": "string",
  "oldStatus": "UnderReview",
  "newStatus": "Available",
  "action": "APPROVED",
  "actionDate": "2024-01-15T10:30:00Z",
  "adminUser": "string",
  "notes": "string",
  "assignedZones": ["string array"],
  "success": true,
  "message": "Rider approved successfully"
}
```

### 2. Reject Rider

**Endpoint:** `POST /api/admin/riders/{riderId}/reject`

**Request Body:**
```json
{
  "reason": "string (required)",
  "notifyRider": "boolean (default: true)"
}
```

**Response (200 OK):**
```json
{
  "riderId": "string",
  "riderName": "string",
  "oldStatus": "UnderReview",
  "newStatus": "Rejected",
  "action": "REJECTED",
  "actionDate": "2024-01-15T10:30:00Z",
  "adminUser": "string",
  "reason": "string",
  "success": true,
  "message": "Rider rejected successfully"
}
```

### 3. Send Back to Pending

**Endpoint:** `POST /api/admin/riders/{riderId}/send-back-to-pending`

**Request Body:**
```json
{
  "message": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "riderId": "string",
  "riderName": "string",
  "oldStatus": "UnderReview|Rejected",
  "newStatus": "PendingVerification",
  "action": "SENT_BACK_TO_PENDING",
  "actionDate": "2024-01-15T10:30:00Z",
  "adminUser": "string",
  "message": "string",
  "success": true,
  "message": "Rider sent back to pending successfully"
}
```

## Business Logic Requirements

### 1. Approval Process
- **Status Validation:** Only riders with "UnderReview" status can be approved
- **Zone Assignment:** If zoneIds are provided, automatically assign rider to those zones
- **Status Update:** Change status from "UnderReview" to "Available"
- **Activity Logging:** Record approval action with admin details and notes
- **Notification:** Send approval notification to rider if notifyRider is true

### 2. Rejection Process
- **Status Validation:** Only riders with "UnderReview" status can be rejected
- **Status Update:** Change status from "UnderReview" to "Rejected"
- **Activity Logging:** Record rejection action with admin details and reason
- **Notification:** Send rejection notification to rider with reason

### 3. Send Back to Pending Process
- **Status Validation:** Only riders with "UnderReview" or "Rejected" status can be sent back
- **Status Update:** Change status to "PendingVerification"
- **Activity Logging:** Record action with admin details and message
- **Notification:** Send notification to rider with instructions

## Button Visibility Rules

### Frontend Button Display Logic:
- **PendingVerification Status:** Show only View button
- **UnderReview Status:** Show View, Approve, Reject, and Send Back to Pending buttons
- **Rejected Status:** Show View and Send Back to Pending buttons
- **Available/Offline Status:** Show View, Suspend, and Zone Assignment buttons
- **Suspended Status:** Show View and Activate buttons

## Database Schema Updates

### Rider Activities Table
```sql
CREATE TABLE rider_activities (
  id UUID PRIMARY KEY,
  rider_id UUID NOT NULL REFERENCES riders(id),
  admin_id UUID REFERENCES admin_users(id),
  action_type VARCHAR(50) NOT NULL, -- 'APPROVED', 'REJECTED', 'SENT_BACK_TO_PENDING'
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  notes TEXT,
  reason TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Rider Notifications Table
```sql
CREATE TABLE rider_notifications (
  id UUID PRIMARY KEY,
  rider_id UUID NOT NULL REFERENCES riders(id),
  notification_type VARCHAR(50) NOT NULL, -- 'STATUS_CHANGE', 'APPROVAL', 'REJECTION'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Rider Zone Assignments Table (if not exists)
```sql
CREATE TABLE rider_zone_assignments (
  id UUID PRIMARY KEY,
  rider_id UUID NOT NULL REFERENCES riders(id),
  zone_id UUID NOT NULL REFERENCES zones(id),
  can_deliver_to BOOLEAN DEFAULT TRUE,
  custom_delivery_fee DECIMAL(10,2),
  custom_delivery_time TIME,
  is_active BOOLEAN DEFAULT TRUE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES admin_users(id),
  UNIQUE(rider_id, zone_id)
);
```

## Implementation Details

### 1. Approval with Zone Assignment
```csharp
[HttpPut("{riderId}/approve")]
public async Task<IActionResult> ApproveRider(string riderId, [FromBody] ApproveRiderRequest request)
{
    // Validate rider exists and has correct status
    var rider = await _riderService.GetByIdAsync(riderId);
    if (rider == null) return NotFound();
    if (rider.Status != RiderStatus.UnderReview) 
        return Conflict("Rider is not under review");

    // Update rider status
    rider.Status = RiderStatus.Available;
    await _riderService.UpdateAsync(rider);

    // Assign zones if provided
    if (request.ZoneIds?.Any() == true)
    {
        foreach (var zoneId in request.ZoneIds)
        {
            await _riderZoneService.AssignRiderToZoneAsync(riderId, zoneId);
        }
    }

    // Log activity
    await _activityService.LogRiderActivityAsync(new RiderActivity 
    {
        RiderId = riderId,
        AdminId = GetCurrentAdminId(),
        ActionType = "APPROVED",
        PreviousStatus = "UnderReview",
        NewStatus = "Available",
        Notes = request.Notes
    });

    // Send notification
    if (request.NotifyRider)
    {
        await _notificationService.SendRiderNotificationAsync(riderId, 
            "Application Approved", 
            "Your rider application has been approved. You can now start accepting deliveries.");
    }

    return Ok(new RiderManagementResult { Success = true, Message = "Rider approved successfully" });
}
```

### 2. Error Handling
- **404 Not Found:** Rider does not exist
- **409 Conflict:** Rider status is not valid for the action
- **400 Bad Request:** Invalid request data or missing required fields
- **500 Internal Server Error:** Database or external service errors

### 3. Security Considerations
- Verify admin has permission to manage riders
- Log all actions for audit trail
- Sanitize input data to prevent XSS
- Validate zone assignments are valid and active
- Rate limit API calls to prevent abuse

### 4. Performance Considerations
- Use database transactions for multi-step operations
- Index rider_id, status, and created_at columns
- Implement proper caching for zone data
- Use background jobs for notifications to avoid blocking requests

### 5. Testing Requirements
- Unit tests for each endpoint
- Integration tests for complete workflows
- Test all status transition validations
- Test zone assignment functionality
- Test notification system integration
- Load testing for concurrent rider management operations

## Notification Templates

### Approval Notification
- **Email Subject:** "Rider Application Approved - Welcome to ChowMate!"
- **SMS:** "Congratulations! Your ChowMate rider application has been approved. Download the app to start earning."
- **In-App:** "Your application has been approved. You can now start accepting delivery requests."

### Rejection Notification
- **Email Subject:** "Rider Application Status Update"
- **Content:** Include specific reason for rejection and steps for reapplication if applicable
- **SMS:** "Your ChowMate rider application requires attention. Check your email for details."

### Send Back to Pending Notification
- **Email Subject:** "Additional Information Required - ChowMate Rider Application"
- **Content:** Include specific message from admin about what needs to be corrected
- **SMS:** "Your rider application needs updates. Check your email for details."