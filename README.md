# FinPlace

A modern family financial management platform built with Next.js, featuring multi-account management, crypto staking, task rewards, and wallet integration.

## Features

- **Multi-Account Management** — Create and manage sub-accounts for different financial goals
- **Virtual Cards** — Issue and manage cards with spending limits
- **Transaction Tracking** — Record and categorize all transactions
- **Crypto Staking** — Stake assets and earn rewards
- **Task & Rewards System** — Assign tasks to family members with monetary rewards
- **Wallet Integration** — Connect crypto wallets for Web3 features
- **Family Accounts** — Supports family-based account structures

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** Supabase Auth
- **State:** Zustand, TanStack Query
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Testing:** Vitest, Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DevvGwardo/nestbank.git
   cd nestbank
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials and database URLs.

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Auth-related pages (login, register)
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages
│   └── onboarding/      # User onboarding flow
├── components/          # React components
│   ├── layout/          # Layout components
│   └── ui/              # Reusable UI components
├── lib/                 # Utility libraries
│   └── supabase/        # Supabase client configs
├── prisma/              # Database schema and migrations
├── tests/               # Test files
│   ├── api/             # API route tests
│   ├── mocks/           # Test mocks
│   └── unit/            # Unit tests
└── types/               # TypeScript type definitions
```

## License

MIT
