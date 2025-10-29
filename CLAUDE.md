# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A business management platform for tracking production, sales, customers, and expenses in a bread manufacturing business. The system manages multiple bread types (orange, blue, green) with dynamic pricing, customer debt tracking, and daily production reporting.

## Development Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack (default port 3000)

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## Architecture & Key Patterns

### Database Architecture (Supabase)

The application uses Supabase with the following core tables and relationships:

- **productions**: Daily production records with bread quantities by color, remaining inventory tracking
- **customers**: Customer information with debt tracking (`has_debt`, `total_debt`)
- **sales**: Links customers to productions, tracks amounts and outstanding balances
- **payments**: Payment records that reduce customer debt and sale outstanding amounts
- **expenses**: Production-related expenses linked to specific production records
- **bread_price**: Dynamic pricing for different bread types (colors)

Key relationships:
- Sales reference both `customer_id` and `production_id`
- Payments reference `customer_id` and optionally `production_id`
- Expenses link to `production_id`

### Service Layer Pattern

All data operations live in `app/services/` as server actions (`"use server"`):

- **bread_price.ts**: CRUD for bread prices, includes `getBreadPriceMultipliers()` which returns a `Record<string, number>` mapping colors to prices with fallback defaults (orange: 1200, blue: 1000, green: 650)
- **productions.ts**: Production lifecycle including `remaining_bread` inventory tracking
  - `updateRemainingBread()`: Decrements inventory when sales occur
  - `calculateBreadTotal()`: Computes monetary value using current bread prices
- **customers.ts**: Customer management with `updateDebtStatus()` for debt calculations
  - Uses Supabase RPC `search_customers` for fuzzy search
  - Uses RPC `calculate_customer_total_spent` for aggregated spending
- **sales.ts**: Sales creation that automatically calls `updateRemainingBread()` when quantity is provided
- **payments.ts**: Payment processing
- **expenses.ts**: Expense tracking per production
- **outstanding.ts**: Outstanding balance queries
- **auth.ts**: Authentication utilities

All services follow this pattern:
- Export TypeScript interfaces for data types
- Use try-catch with error logging
- Call `revalidateTag()` after mutations to invalidate Next.js cache
- Return structured responses: `{ status: "SUCCESS" | "ERROR", error: string, data?: any }`

### Supabase Client Setup

Single client instance in `client.ts`:
- Uses `@supabase/supabase-js` `createClient()`
- Validates required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Throws explicit errors if env vars missing

Environment files:
- `.env.local`: Base configuration
- `.env.development.local`: Development overrides

### Authentication & Middleware

Middleware (`middleware.js`) handles:
- Session refresh using `@supabase/ssr` server client
- Route protection: redirects unauthenticated users from `/dashboard` to `/login`
- Auto-redirect authenticated users from `/login` to `/dashboard`
- Bypasses auth check for `/auth/callback`

### Component Organization

```
app/
├── components/
│   ├── dashboard/     # Dashboard-specific components
│   ├── customer/      # Customer management UI
│   ├── production/    # Production forms and displays
│   ├── productions/   # Production list components (note plural)
│   ├── expenses/      # Expense forms
│   ├── payments/      # Payment forms
│   └── login/         # Auth forms
├── services/          # Server actions for data operations
├── calculator/        # Bread calculator feature
├── customers/         # Customer routes
├── production/        # Individual production pages
├── productions/       # Production list pages
├── expenses/          # Expense routes
├── payment/           # Payment routes
├── sale/             # Sale routes
└── settings/         # Settings pages

components/
└── ui/               # Shadcn/ui components (Button, Card, Dialog, etc.)
```

### Bread Quantity Objects

Throughout the codebase, bread quantities use this structure:
```typescript
{
  orange: number,
  blue: number,
  green: number,
  [key: string]: number  // Allows future bread types
}
```

This pattern appears in:
- `Production.quantity`: Initial production amounts
- `Production.old_bread`: Previous day's unsold bread
- `Production.remaining_bread`: Current inventory (calculated as quantity + old_bread, decremented by sales)
- Sale quantity tracking

### State Management & Revalidation

No global state library. Uses:
- Server components with async data fetching
- Next.js cache tags for revalidation: `revalidateTag("customers")`, `revalidateTag("productions")`, etc.
- Client components only where interactivity needed

### UI Components

Built with:
- **Radix UI** primitives (Avatar, Dialog, Dropdown, Label, Switch)
- **Tailwind CSS v4** with custom config
- **Shadcn/ui** patterns in `components/ui/`
- **Lucide React** for icons
- **Sonner** for toast notifications
- **next-themes** for dark mode

## Key Business Logic

### Production Workflow
1. Create production with quantities for each bread color
2. Add any `old_bread` from previous day
3. System calculates `remaining_bread = quantity + old_bread`
4. When sales occur, `remaining_bread` is decremented
5. Expenses can be attached to track production costs

### Sales & Debt Flow
1. Sale created linking customer + production with amount
2. If not paid immediately, creates `outstanding` balance on sale
3. Sets or updates customer `total_debt` and `has_debt` flag
4. Payments reduce both sale `outstanding` and customer `total_debt`
5. When `total_debt` reaches 0, `has_debt` auto-updates to `false`

### Dynamic Pricing
- Bread prices stored in `bread_price` table by color
- `getBreadPriceMultipliers()` fetches current prices
- `calculateBreadTotal()` computes value of bread quantities
- Prices can be updated in settings (likely `/settings/change_price`)

## TypeScript Configuration

Strict mode enabled with:
- Target: ES2017
- Module: esnext with bundler resolution
- JSX: react-jsx (React 19)
- Path alias: `@/*` maps to root
- Incremental builds enabled

## Important Notes

- **Server Actions**: All database operations use `"use server"` directive
- **Error Handling**: Services log errors but return empty arrays/null rather than throwing
- **Inventory Management**: `remaining_bread` is source of truth for current stock
- **Authentication**: Required for `/dashboard` routes, uses Supabase Auth
- **Cache Strategy**: Aggressive use of `revalidateTag()` ensures fresh data after mutations
- **Colors as Keys**: Bread types identified by color strings (lowercase: "orange", "blue", "green")
- **Fallback Values**: `getBreadPriceMultipliers()` includes hardcoded defaults if DB fails

## Database Functions (Supabase RPC)

The app relies on these Supabase stored procedures:
- `search_customers(search_term: string)`: Fuzzy search for customers
- `calculate_customer_total_spent(customer_uuid: string)`: Aggregate spending calculation