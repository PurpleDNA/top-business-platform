---
trigger: always_on
---

# System Context: top-business-platform

This file serves as the definitive source of truth for the `top-business-platform` project. It documents the architecture, key patterns, business logic, and conventions to ensure consistent and high-quality development.

## 1. Project Overview

- **Name**: `top-business-platform`
- **Purpose**: A comprehensive business management platform designed for a bread manufacturing business (Top Business). Its primary goal is to digitize and streamline the tracking of production, sales, customer debts, and operational expenses to enable data-driven decision-making.
- **Core Domains**:
    - **Production**: Tracking daily bread output (categorized by type: Orange, Blue, Green).
    - **Sales**: Managing transactions, linking customers to productions, and tracking outstanding balances.
    - **Customers**: Managing customer profiles, credit, and debt lifecycles.
    - **Expenses**: Tracking production-related costs.
    - **Pricing**: Configurable, dynamic pricing for different bread types.

## 2. Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4, custom Shadcn/ui implementation (Radix Primitives), Lucide React icons.
- **Backend & Database**: Supabase (PostgreSQL) - utilizing Supabase Auth and `postgres-js`.
- **Testing**: Playwright for E2E testing.
- **Key Libraries**:
    - `zod`: Schema validation.
    - `sonner`: Toast notifications.
    - `vaul`: Drawer components.
    - `@supabase/ssr`: Server-side rendering support for Supabase.

## 3. Architecture & Patterns

### 3.1 Database Modeling (Supabase/PostgreSQL)

The database schema is designed around the core business entities:

- **`productions`**:
    - Records daily production runs.
    - `quantity` (JSONB): Stores count of each bread type produced (e.g., `{"orange": 100, "blue": 50}`).
    - `remaining_bread` (JSONB): Tracks inventory available for sale. Updated transactionally.
- **`customers`**:
    - `total_debt`: Aggregate debt from unpaid or partially paid sales.
    - `has_debt`: Boolean flag derived from `total_debt > 0`.
- **`sales`**:
    - Links a specific `customer` to a `production` batch.
    - Key fields: `total_amount`, `paid_amount`, `outstanding` (calculated as `total - paid`).
- **`payments`**:
    - Records payments made by customers to reduce their debt.
- **`bread_price`**:
    - Stores dynamic pricing multipliers/configurations for the bread types.
- **`expenses`**:
    - Tracks operational costs associated with specific productions or general overhead.

### 3.2 Service Layer Pattern

All business logic and data access reside in the `app/services/` directory. Direct database calls from UI components are forbidden.

- **Server Actions**: All service functions are Next.js Server Actions (`"use server"`).
- **Return Type**: Standardized response format:
  ```typescript
  type ServiceResponse<T> = {
    status: "SUCCESS" | "ERROR";
    data?: T;
    error?: string;
  }
  ```
- **Caching**: Aggressive use of `revalidateTag()` to ensure data consistency after mutations (tags: "customers", "productions", "sales", etc.).
- **Files**:
    - `productions.ts`: Production CRUD, inventory management logic.
    - `customers.ts`: Customer CRUD, debt calculations.
    - `sales.ts`: Sale creation, updating inventory (decrementing `remaining_bread`), debt updates.
    - `bread_price.ts`: Pricing logic helpers.

### 3.3 Directory Structure & Routing

- **Routes**:
    - **Creation**: Singular naming convention (e.g., `app/sale/new`, `app/production/new`).
    - **Listing/Management**: Plural naming convention (e.g., `app/sales`, `app/productions`).
- **Components**:
    - `components/ui/`: Generic, reusable UI atoms (Shadcn/ui derived).
    - `app/components/`: Feature-specific components organized by domain.

## 4. Business Logic Rules

1.  **Bread Identity**: Bread types are strictly identified by color strings: `"orange"`, `"blue"`, `"green"`.
2.  **Inventory Source of Truth**:
    - `remaining_bread` in the `productions` table is the definitive inventory count.
    - *Calculation*: `remaining_bread` = `initial_quantity` + `returned_old_bread` - `sold_quantity`.
    - Sales must fail if sufficient inventory is not available.
3.  **Debt Cycle**:
    - **Sale Creation**: If `paid_amount < total_amount`, the difference is added to the Customer's `total_debt` and the sale's `outstanding` field.
    - **Payment**: Applying a payment decreasing the Customer's `total_debt`.
    - **Debt Flag**: The `has_debt` flag on the Customer entity must be automatically maintained based on `total_debt > 0`.

## 5. Development Workflow

- **Local Dev**: `npm run dev` (uses Turbopack).
- **Linting**: `npm run lint` (ESLint config).
- **Build**: `npm run build` (Next.js production build).
- **Environment Variables**:
    - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public API key.

## 6. Design & UX Guidelines

- **Aesthetics**: Premium, modern feel. Use whitespace effectively.
- **Visuals**: Distinct color coding for bread types (Orange/Blue/Green) in UI elements.
- **Feedback**: Use `sonner` for toast notifications on success/error of Server Actions.
- **Responsiveness**: Mobile-first design approach given the operational nature of the platform.

