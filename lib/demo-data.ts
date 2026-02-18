// In-memory demo data store — persists during dev server session, resets on restart
// Activated when NEXT_PUBLIC_DEMO_MODE=true

import { v4 as uuid } from "uuid"

export const DEMO_USER_ID = "demo-user-001"

export const demoUser = {
  id: DEMO_USER_ID,
  email: "demo@finplace.app",
  name: "Alex Demo",
  image: null,
  phone: "+1 555-0100",
  accountType: "family",
  walletAddress: "0xdemo...a1b2",
  walletVerified: false,
  onboardingComplete: true,
  settings: {},
  createdAt: new Date("2025-12-01"),
  updatedAt: new Date(),
}

// --- Accounts ---

const accountIds = {
  checking: "acct-checking-001",
  savings: "acct-savings-002",
  investment: "acct-invest-003",
  kids: "acct-kids-004",
}

let accounts = [
  {
    id: accountIds.checking,
    userId: DEMO_USER_ID,
    name: "Main Checking",
    type: "checking",
    balance: 4825.5,
    currency: "USD",
    color: "#22c55e",
    icon: "wallet",
    isActive: true,
    settings: {},
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date(),
  },
  {
    id: accountIds.savings,
    userId: DEMO_USER_ID,
    name: "Family Savings",
    type: "savings",
    balance: 12340.0,
    currency: "USD",
    color: "#3b82f6",
    icon: "piggy-bank",
    isActive: true,
    settings: {},
    createdAt: new Date("2025-12-05"),
    updatedAt: new Date(),
  },
  {
    id: accountIds.investment,
    userId: DEMO_USER_ID,
    name: "Investment Account",
    type: "investment",
    balance: 8750.25,
    currency: "USD",
    color: "#a855f7",
    icon: "trending-up",
    isActive: true,
    settings: {},
    createdAt: new Date("2025-12-10"),
    updatedAt: new Date(),
  },
  {
    id: accountIds.kids,
    userId: DEMO_USER_ID,
    name: "Emma's Account",
    type: "allowance",
    balance: 185.0,
    currency: "USD",
    color: "#f59e0b",
    icon: "star",
    isActive: true,
    settings: {},
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date(),
  },
]

// --- Transactions ---

let transactions = [
  {
    id: "tx-001",
    userId: DEMO_USER_ID,
    accountId: accountIds.checking,
    type: "deposit",
    amount: 3200.0,
    currency: "USD",
    description: "Payroll deposit",
    category: "Income",
    status: "completed",
    counterparty: "Employer Inc.",
    metadata: {},
    createdAt: new Date("2026-02-15T09:00:00"),
    account: { name: "Main Checking" },
  },
  {
    id: "tx-002",
    userId: DEMO_USER_ID,
    accountId: accountIds.checking,
    type: "withdrawal",
    amount: -89.5,
    currency: "USD",
    description: "Whole Foods Market",
    category: "Groceries",
    status: "completed",
    counterparty: "Whole Foods",
    metadata: {},
    createdAt: new Date("2026-02-14T14:30:00"),
    account: { name: "Main Checking" },
  },
  {
    id: "tx-003",
    userId: DEMO_USER_ID,
    accountId: accountIds.checking,
    type: "withdrawal",
    amount: -12.99,
    currency: "USD",
    description: "Netflix subscription",
    category: "Subscriptions",
    status: "completed",
    counterparty: "Netflix",
    metadata: {},
    createdAt: new Date("2026-02-13T00:00:00"),
    account: { name: "Main Checking" },
  },
  {
    id: "tx-004",
    userId: DEMO_USER_ID,
    accountId: accountIds.savings,
    type: "transfer",
    amount: 500.0,
    currency: "USD",
    description: "Transfer from Main Checking",
    category: "Transfer",
    status: "completed",
    counterparty: null,
    metadata: {},
    createdAt: new Date("2026-02-12T11:00:00"),
    account: { name: "Family Savings" },
  },
  {
    id: "tx-005",
    userId: DEMO_USER_ID,
    accountId: accountIds.checking,
    type: "transfer",
    amount: -500.0,
    currency: "USD",
    description: "Transfer to Family Savings",
    category: "Transfer",
    status: "completed",
    counterparty: null,
    metadata: {},
    createdAt: new Date("2026-02-12T11:00:00"),
    account: { name: "Main Checking" },
  },
  {
    id: "tx-006",
    userId: DEMO_USER_ID,
    accountId: accountIds.checking,
    type: "withdrawal",
    amount: -45.0,
    currency: "USD",
    description: "Uber ride",
    category: "Transport",
    status: "completed",
    counterparty: "Uber",
    metadata: {},
    createdAt: new Date("2026-02-11T18:45:00"),
    account: { name: "Main Checking" },
  },
  {
    id: "tx-007",
    userId: DEMO_USER_ID,
    accountId: accountIds.kids,
    type: "deposit",
    amount: 25.0,
    currency: "USD",
    description: "Weekly allowance",
    category: "Allowance",
    status: "completed",
    counterparty: null,
    metadata: {},
    createdAt: new Date("2026-02-10T08:00:00"),
    account: { name: "Emma's Account" },
  },
  {
    id: "tx-008",
    userId: DEMO_USER_ID,
    accountId: accountIds.investment,
    type: "deposit",
    amount: 1000.0,
    currency: "USD",
    description: "Monthly investment contribution",
    category: "Investment",
    status: "completed",
    counterparty: null,
    metadata: {},
    createdAt: new Date("2026-02-01T09:00:00"),
    account: { name: "Investment Account" },
  },
  {
    id: "tx-009",
    userId: DEMO_USER_ID,
    accountId: accountIds.checking,
    type: "withdrawal",
    amount: -67.83,
    currency: "USD",
    description: "Starbucks",
    category: "Food & Drink",
    status: "completed",
    counterparty: "Starbucks",
    metadata: {},
    createdAt: new Date("2026-02-09T07:30:00"),
    account: { name: "Main Checking" },
  },
  {
    id: "tx-010",
    userId: DEMO_USER_ID,
    accountId: accountIds.checking,
    type: "deposit",
    amount: 150.0,
    currency: "USD",
    description: "Venmo from Sarah",
    category: "Income",
    status: "completed",
    counterparty: "Sarah M.",
    metadata: {},
    createdAt: new Date("2026-02-08T16:00:00"),
    account: { name: "Main Checking" },
  },
]

// --- Staking Positions ---

let stakingPositions = [
  {
    id: "stake-001",
    userId: DEMO_USER_ID,
    asset: "USD",
    amount: 5000.0,
    apy: 5.2,
    earned: 43.33,
    lockPeriod: 30,
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-02-14"),
    status: "active",
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "stake-002",
    userId: DEMO_USER_ID,
    asset: "USD",
    amount: 2500.0,
    apy: 7.8,
    earned: 16.25,
    lockPeriod: 90,
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-05-02"),
    status: "active",
    createdAt: new Date("2026-02-01"),
  },
]

// --- Accessor & Mutation Functions ---

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true"
}

export function getDemoAccounts() {
  return [...accounts]
}

export function getDemoAccount(id: string) {
  return accounts.find((a) => a.id === id) ?? null
}

export function createDemoAccount(data: {
  name: string
  type: string
  currency?: string
  color?: string
  icon?: string
}) {
  const account = {
    id: `acct-${uuid().slice(0, 8)}`,
    userId: DEMO_USER_ID,
    name: data.name,
    type: data.type,
    balance: 0,
    currency: data.currency || "USD",
    color: data.color || "#22c55e",
    icon: data.icon || "wallet",
    isActive: true,
    settings: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  accounts.unshift(account)
  return account
}

export function getDemoTransactions(type?: string) {
  const sorted = [...transactions].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )
  if (type) return sorted.filter((tx) => tx.type === type)
  return sorted
}

export function getRecentDemoTransactions(limit: number) {
  return getDemoTransactions().slice(0, limit)
}

export function getDemoTotalBalance(): number {
  return accounts.reduce((sum, a) => sum + a.balance, 0)
}

export function getDemoStakingSummary() {
  const active = stakingPositions.filter((p) => p.status === "active")
  let stakedBalance = 0
  let earnedTotal = 0
  let weightedApySum = 0

  for (const pos of stakingPositions) {
    if (pos.status === "active") {
      stakedBalance += pos.amount
      weightedApySum += pos.apy * pos.amount
    }
    earnedTotal += pos.earned
  }

  const weightedApy =
    stakedBalance > 0
      ? Math.round((weightedApySum / stakedBalance) * 100) / 100
      : 0

  return {
    stakedBalance,
    earnedTotal,
    weightedApy,
    positions: stakingPositions.map((p) => ({ ...p })),
  }
}

export function demoTransfer(
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  note?: string
): { success: boolean; error?: string } {
  const from = accounts.find((a) => a.id === fromAccountId)
  const to = accounts.find((a) => a.id === toAccountId)

  if (!from) return { success: false, error: "Source account not found" }
  if (!to) return { success: false, error: "Destination account not found" }
  if (from.balance < amount)
    return { success: false, error: "Insufficient balance" }

  from.balance = Math.round((from.balance - amount) * 100) / 100
  to.balance = Math.round((to.balance + amount) * 100) / 100
  from.updatedAt = new Date()
  to.updatedAt = new Date()

  const now = new Date()
  transactions.unshift(
    {
      id: `tx-${uuid().slice(0, 8)}`,
      userId: DEMO_USER_ID,
      accountId: fromAccountId,
      type: "transfer",
      amount: -amount,
      currency: "USD",
      description: `Transfer to ${to.name}${note ? ` — ${note}` : ""}`,
      category: "Transfer",
      status: "completed",
      counterparty: null,
      metadata: {},
      createdAt: now,
      account: { name: from.name },
    },
    {
      id: `tx-${uuid().slice(0, 8)}`,
      userId: DEMO_USER_ID,
      accountId: toAccountId,
      type: "transfer",
      amount: amount,
      currency: "USD",
      description: `Transfer from ${from.name}${note ? ` — ${note}` : ""}`,
      category: "Transfer",
      status: "completed",
      counterparty: null,
      metadata: {},
      createdAt: now,
      account: { name: to.name },
    }
  )

  return { success: true }
}

export function demoFund(
  accountId: string,
  amount: number,
  source: string
): { success: boolean; error?: string } {
  const account = accounts.find((a) => a.id === accountId)
  if (!account) return { success: false, error: "Account not found" }

  account.balance = Math.round((account.balance + amount) * 100) / 100
  account.updatedAt = new Date()

  transactions.unshift({
    id: `tx-${uuid().slice(0, 8)}`,
    userId: DEMO_USER_ID,
    accountId,
    type: "deposit",
    amount,
    currency: "USD",
    description: `Deposit from ${source}`,
    category: "Deposit",
    status: "completed",
    counterparty: source,
    metadata: {},
    createdAt: new Date(),
    account: { name: account.name },
  })

  return { success: true }
}

export function demoStake(data: {
  asset: string
  amount: number
  apy: number
  lockPeriod: number
}) {
  const now = new Date()
  const endDate = new Date(now)
  endDate.setDate(endDate.getDate() + data.lockPeriod)

  const position = {
    id: `stake-${uuid().slice(0, 8)}`,
    userId: DEMO_USER_ID,
    asset: data.asset,
    amount: data.amount,
    apy: data.apy,
    earned: 0,
    lockPeriod: data.lockPeriod,
    startDate: now,
    endDate,
    status: "active",
    createdAt: now,
  }
  stakingPositions.unshift(position)
  return position
}

export function demoUnstake(
  positionId: string
): { success: boolean; error?: string } {
  const pos = stakingPositions.find((p) => p.id === positionId)
  if (!pos) return { success: false, error: "Staking position not found" }

  pos.status = "completed"
  return { success: true }
}
