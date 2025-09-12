# TypeScript Build Guidelines for Chowmate Web App

This document outlines best practices and common pitfalls to avoid TypeScript compilation errors and build issues in the Chowmate Web App.

## Table of Contents
- [Type System Guidelines](#type-system-guidelines)
- [Import/Export Best Practices](#importexport-best-practices)
- [API Response Patterns](#api-response-patterns)
- [Component Patterns](#component-patterns)
- [Common Build Errors](#common-build-errors)
- [Development Workflow](#development-workflow)

## Type System Guidelines

### 1. Always Use Proper Type Definitions

**✅ DO:**
```typescript
// Use specific types from our type definitions
import { Customer } from '@/app/data/types/customer';
import { PaginatedResponse } from '@/app/data/types/api';

const customer: Customer = await customerRepository.getById(id);
const customers: PaginatedResponse<Customer> = await customerRepository.getAll();
```

**❌ DON'T:**
```typescript
// Avoid any or generic objects
const customer: any = await customerRepository.getById(id);
const customers: object = await customerRepository.getAll();
```

### 2. Extend Base Types Properly

**✅ DO:**
```typescript
// Always extend Record<string, unknown> for API request types
export interface ApproveVendorRequest extends Record<string, unknown> {
  reason?: string;
  notifyVendor?: boolean;
}

export interface VendorFilters extends Record<string, unknown> {
  search?: string;
  status?: VendorStatus;
  pageNumber?: number;
  pageSize?: number;
}
```

**❌ DON'T:**
```typescript
// Missing base type extension will cause isolatedModules errors
export interface ApproveVendorRequest {
  reason?: string;
  notifyVendor?: boolean;
}
```

### 3. Handle React Component Props Correctly

**✅ DO:**
```typescript
// Type component props properly
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

// Cast unknown types to React.ReactNode in render functions
return item[column.key] as React.ReactNode;
```

## Import/Export Best Practices

### 1. Use Export Type for Type-Only Exports

**✅ DO:**
```typescript
// In type definition files
export type { Customer } from './customer';
export type { Vendor } from './vendor';

// For isolatedModules compatibility
export type VendorStatus = 'Active' | 'Suspended' | 'Pending';
```

**❌ DON'T:**
```typescript
// This will cause isolatedModules errors
export VendorStatus = 'Active' | 'Suspended' | 'Pending';
```

### 2. Import Types from Correct Locations

**✅ DO:**
```typescript
// Import from the specific type file
import { User } from '@/app/data/types/application-user';
import { Vendor } from '@/app/data/types/vendor';
import { Customer } from '@/app/data/types/customer';
```

**❌ DON'T:**
```typescript
// Avoid importing from generic entities file
import { User } from '@/app/data/types/entities';
```

## API Response Patterns

### 1. PaginatedResponse Structure

**✅ DO:**
```typescript
// Always use 'items' property for paginated data
interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Access paginated data correctly
const customers = response.items; // ✅
const hasData = response.items.length > 0; // ✅
```

**❌ DON'T:**
```typescript
// Don't use 'data' property - it doesn't exist
const customers = response.data; // ❌ Will cause build error
```

### 2. Currency Formatting

**✅ DO:**
```typescript
// Use formatCurrency utility for all monetary values
import { formatCurrency } from '@/app/lib/utils/format-currency';

const formattedAmount = formatCurrency(order.totalAmount);
const revenueDisplay = formatCurrency(vendor.totalRevenue);
```

**❌ DON'T:**
```typescript
// Don't use hardcoded currency symbols
const display = `$${amount.toFixed(2)}`; // ❌
const display = `₦${amount.toLocaleString()}`; // ❌
```

## Component Patterns

### 1. useSearchParams with Suspense

**✅ DO:**
```typescript
// Wrap useSearchParams in Suspense boundary
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const LoginContent = () => {
  const searchParams = useSearchParams();
  // ... component logic
};

const LoginPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LoginContent />
  </Suspense>
);
```

**❌ DON'T:**
```typescript
// Don't use useSearchParams directly in page components
const LoginPage = () => {
  const searchParams = useSearchParams(); // ❌ Will cause Suspense error
  // ... rest of component
};
```

### 2. Modal and Table Component Patterns

**✅ DO:**
```typescript
// Use proper typing for table data
interface TableProps<T> {
  data: T[];
  loading?: boolean;
  onRowSelect?: (item: T) => void;
}

// Filter arrays correctly in modals
const filteredItems = useMemo(() => {
  if (!availableItems) return [];
  
  return availableItems.filter(item => 
    item.id !== currentItemId // Exclude current item
  );
}, [availableItems, currentItemId]);
```

## Common Build Errors

### 1. TypeScript Compilation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Property 'data' does not exist` | Using wrong property name | Use `items` for PaginatedResponse |
| `Cannot find module` | Wrong import path | Check correct type file location |
| `Type is not assignable` | Missing base type extension | Extend `Record<string, unknown>` |
| `useSearchParams should be wrapped in Suspense` | Missing Suspense boundary | Wrap in Suspense component |

### 2. Build Cache Issues

**Symptoms:**
- Build shows different errors than code
- TypeScript errors persist after fixes

**Solutions:**
```bash
# Method 1: Rename .next directory
mv .next .next-backup && npm run build

# Method 2: Clear TypeScript cache
npx tsc --build --clean && npm run build

# Method 3: Full clean (if permissions allow)
rm -rf .next && npm run build
```

### 3. Permission Issues with .next Directory

**Symptoms:**
- `EACCES: permission denied` errors
- Cannot delete .next directory

**Solution:**
```bash
# Rename instead of delete
mv .next .next-backup-$(date +%s) && npm run build
```

## Development Workflow

### 1. Pre-Build Checklist

Before running `npm run build`, verify:

- [ ] All imports use correct paths
- [ ] API response types use `items` not `data`
- [ ] Request interfaces extend `Record<string, unknown>`
- [ ] Currency formatting uses `formatCurrency()`
- [ ] useSearchParams wrapped in Suspense
- [ ] Type-only exports use `export type`

### 2. Build Command Sequence

```bash
# 1. Run type check first
npx tsc --noEmit

# 2. Run linting (optional)
npm run lint

# 3. Run build
npm run build

# 4. If build fails due to cache, clean and retry
mv .next .next-backup && npm run build
```

### 3. Common File Patterns

#### Repository Files
```typescript
export class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super('/api/customers');
  }
  
  // Custom methods with proper typing
  async getCustomerOrders(customerId: string): Promise<PaginatedResponse<CustomerOrder>> {
    return this.get<PaginatedResponse<CustomerOrder>>(`/${customerId}/orders`);
  }
}
```

#### Component Files
```typescript
interface ComponentProps {
  data: SomeType[];
  loading?: boolean;
  onAction?: (item: SomeType) => void;
}

export default function Component({ data, loading, onAction }: ComponentProps) {
  // Component logic with proper typing
}
```

#### Type Definition Files
```typescript
export interface SomeType extends BaseEntity {
  // Properties
}

export interface SomeRequest extends Record<string, unknown> {
  // Request properties
}

export type SomeStatus = 'Active' | 'Inactive' | 'Pending';
```

## Key Reminders

1. **Always use `items` property for paginated responses**
2. **Extend `Record<string, unknown>` for request types**
3. **Import types from specific files, not generic entities**
4. **Wrap useSearchParams in Suspense boundaries**
5. **Use formatCurrency() for all monetary displays**
6. **Clean build cache when facing persistent errors**
7. **Run type checking before builds to catch errors early**

Following these guidelines will help prevent the most common TypeScript compilation errors and ensure smooth builds for the Chowmate Web App.