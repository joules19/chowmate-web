# Backend Advertisement API Implementation Guide

## Overview

This document provides detailed instructions for implementing the backend API endpoints to support the customer advertisement sheet system in the Chowmate mobile app.

## Database Schema

### Advertisements Table

```sql
CREATE TABLE advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'vendor', 'rider')),
    background_color VARCHAR(20) DEFAULT 'default' CHECK (background_color IN ('default', 'blue', 'green', 'orange', 'purple', 'pink')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Indexes for performance
    INDEX idx_advertisements_user_type_active (user_type, is_active),
    INDEX idx_advertisements_vendor_id (vendor_id),
    INDEX idx_advertisements_created_at (created_at)
);
```

### Trigger for Updated At

```sql
CREATE OR REPLACE FUNCTION update_advertisements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER advertisements_updated_at_trigger
    BEFORE UPDATE ON advertisements
    FOR EACH ROW
    EXECUTE FUNCTION update_advertisements_updated_at();
```

## API Endpoints

### 1. Get Active Advertisements

**Endpoint:** `GET /api/advertisements/active`

**Authentication:** Required (Bearer token)

**Description:** Fetch active advertisements filtered by authenticated user's role

**Implementation:**

```javascript
// Node.js/Express example
router.get('/active', authenticate, async (req, res) => {
    try {
        const userType = req.user.role; // Extract from JWT token
        
        const advertisements = await db.query(`
            SELECT 
                a.id,
                a.title,
                a.description,
                a.image_url as "imageUrl",
                a.vendor_id as "vendorId",
                v.business_name as "vendorName",
                v.business_type as "businessType",
                a.background_color as "backgroundColor",
                a.is_active as "isActive",
                a.created_at as "createdAt",
                a.updated_at as "updatedAt"
            FROM advertisements a
            LEFT JOIN vendors v ON a.vendor_id = v.id
            WHERE a.is_active = true 
            AND a.user_type = $1
            ORDER BY a.created_at DESC
            LIMIT 5
        `, [userType]);
        
        res.json({
            success: true,
            message: 'Active advertisements retrieved successfully',
            data: advertisements.rows
        });
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch advertisements',
            data: []
        });
    }
});
```

### 2. Mark Advertisement as Viewed (Optional Analytics)

**Endpoint:** `POST /api/advertisements/:advertisementId/viewed`

**Authentication:** Required (Bearer token)

**Description:** Track advertisement views for analytics

**Implementation:**

```javascript
router.post('/:advertisementId/viewed', authenticate, async (req, res) => {
    try {
        const { advertisementId } = req.params;
        const userId = req.user.id;
        
        // Insert or update view record
        await db.query(`
            INSERT INTO advertisement_views (advertisement_id, user_id, viewed_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (advertisement_id, user_id) 
            DO UPDATE SET viewed_at = NOW()
        `, [advertisementId, userId]);
        
        res.json({
            success: true,
            message: 'Advertisement marked as viewed'
        });
    } catch (error) {
        console.error('Error marking advertisement as viewed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark advertisement as viewed'
        });
    }
});
```

### 3. Track Advertisement Click (Optional Analytics)

**Endpoint:** `POST /api/advertisements/:advertisementId/click`

**Authentication:** Required (Bearer token)

**Description:** Track advertisement clicks for analytics

**Implementation:**

```javascript
router.post('/:advertisementId/click', authenticate, async (req, res) => {
    try {
        const { advertisementId } = req.params;
        const userId = req.user.id;
        
        // Insert click record
        await db.query(`
            INSERT INTO advertisement_clicks (advertisement_id, user_id, clicked_at)
            VALUES ($1, $2, NOW())
        `, [advertisementId, userId]);
        
        res.json({
            success: true,
            message: 'Advertisement click tracked'
        });
    } catch (error) {
        console.error('Error tracking advertisement click:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track advertisement click'
        });
    }
});
```

## Admin Management Endpoints (For Staff)

### 1. Create Advertisement

**Endpoint:** `POST /api/admin/advertisements`

**Authentication:** Required (Admin/Staff only)

```javascript
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const {
            title,
            description,
            imageUrl,
            vendorId,
            userType,
            backgroundColor = 'default'
        } = req.body;
        
        const result = await db.query(`
            INSERT INTO advertisements (
                title, description, image_url, vendor_id, 
                user_type, background_color, created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [title, description, imageUrl, vendorId, userType, backgroundColor, req.user.id]);
        
        res.status(201).json({
            success: true,
            message: 'Advertisement created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating advertisement:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create advertisement'
        });
    }
});
```

### 2. Toggle Advertisement Status

**Endpoint:** `PUT /api/admin/advertisements/:id/toggle-status`

**Authentication:** Required (Admin/Staff only)

```javascript
router.put('/:id/toggle-status', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query(`
            UPDATE advertisements 
            SET is_active = NOT is_active, updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }
        
        res.json({
            success: true,
            message: `Advertisement ${result.rows[0].is_active ? 'activated' : 'deactivated'} successfully`,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error toggling advertisement status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle advertisement status'
        });
    }
});
```

## Optional Analytics Tables

### Advertisement Views Table

```sql
CREATE TABLE advertisement_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advertisement_id UUID NOT NULL REFERENCES advertisements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(advertisement_id, user_id)
);
```

### Advertisement Clicks Table

```sql
CREATE TABLE advertisement_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advertisement_id UUID NOT NULL REFERENCES advertisements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Considerations

1. **Authentication:** All endpoints require valid JWT tokens
2. **Authorization:** User type filtering prevents cross-role data access
3. **Input Validation:** Validate all input parameters
4. **Rate Limiting:** Implement rate limiting for analytics endpoints
5. **Image Upload:** Secure image upload to cloud storage (AWS S3, etc.)

## Performance Optimization

1. **Database Indexing:** Create indexes on frequently queried columns
2. **Caching:** Cache active advertisements with Redis (5-10 minutes TTL)
3. **CDN:** Use CDN for advertisement images
4. **Query Limits:** Limit results to prevent large responses

## Response Format

All endpoints follow this consistent response format:

```json
{
    "success": boolean,
    "message": string,
    "data": object | array | null
}
```

## Error Handling

Implement comprehensive error handling:

- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error (unexpected errors)

## Testing

Create comprehensive tests for:

1. **Unit Tests:** Individual endpoint functionality
2. **Integration Tests:** Database interactions
3. **Authentication Tests:** Token validation
4. **Performance Tests:** Load testing with multiple concurrent requests

## Deployment Notes

1. **Environment Variables:** Store sensitive configuration in environment variables
2. **Database Migrations:** Run database migrations in production
3. **Monitoring:** Set up logging and monitoring for advertisement endpoints
4. **Backup:** Ensure advertisement data is included in database backups

## Usage Flow

1. **Staff creates advertisement** via admin panel
2. **Staff sets advertisement as active**
3. **Customer logs in and lands on home screen**
4. **Mobile app fetches active advertisements** for customer role
5. **Advertisement sheet displays** if advertisements exist
6. **User interacts** with advertisement (view/click tracked)
7. **User navigates to vendor storefront** or dismisses sheet