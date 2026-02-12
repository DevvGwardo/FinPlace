import { describe, it, expect, vi, beforeEach } from "vitest"
import { prismaMock } from "../mocks/prisma"
import { authMock, mockSession } from "../mocks/auth"
import {
  getTotalBalance,
  getSubAccounts,
  getRecentTransactions,
  getStakingSummary,
} from "@/lib/queries"

// Mock serialize module
vi.mock("@/lib/serialize", () => ({
  toNumber: (val: unknown) => {
    if (val === null || val === undefined) return 0
    if (typeof val === "number") return val
    return Number(val) || 0
  },
}))

describe("getTotalBalance", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue(mockSession)
  })

  it("returns 0 when not authenticated", async () => {
    authMock.mockResolvedValue(null)
    const balance = await getTotalBalance()
    expect(balance).toBe(0)
  })

  it("returns aggregated balance", async () => {
    prismaMock.subAccount.aggregate.mockResolvedValue({
      _sum: { balance: 1500.75 },
    })

    const balance = await getTotalBalance()
    expect(balance).toBe(1500.75)
    expect(prismaMock.subAccount.aggregate).toHaveBeenCalledWith({
      where: { userId: "test-user-id" },
      _sum: { balance: true },
    })
  })

  it("returns 0 when no accounts exist", async () => {
    prismaMock.subAccount.aggregate.mockResolvedValue({
      _sum: { balance: null },
    })

    const balance = await getTotalBalance()
    expect(balance).toBe(0)
  })
})

describe("getSubAccounts", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue(mockSession)
  })

  it("returns empty array when not authenticated", async () => {
    authMock.mockResolvedValue(null)
    const accounts = await getSubAccounts()
    expect(accounts).toEqual([])
  })

  it("returns accounts with numeric balances", async () => {
    prismaMock.subAccount.findMany.mockResolvedValue([
      { id: "acc-1", name: "Checking", balance: 500, createdAt: new Date() },
      { id: "acc-2", name: "Savings", balance: 1200, createdAt: new Date() },
    ])

    const accounts = await getSubAccounts()
    expect(accounts).toHaveLength(2)
    expect(accounts[0].balance).toBe(500)
    expect(accounts[1].balance).toBe(1200)
  })

  it("orders by createdAt desc", async () => {
    prismaMock.subAccount.findMany.mockResolvedValue([])
    await getSubAccounts()

    expect(prismaMock.subAccount.findMany).toHaveBeenCalledWith({
      where: { userId: "test-user-id" },
      orderBy: { createdAt: "desc" },
    })
  })
})

describe("getRecentTransactions", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue(mockSession)
  })

  it("returns empty array when not authenticated", async () => {
    authMock.mockResolvedValue(null)
    const txs = await getRecentTransactions()
    expect(txs).toEqual([])
  })

  it("returns transactions with numeric amounts", async () => {
    prismaMock.transaction.findMany.mockResolvedValue([
      { id: "tx-1", amount: 50, type: "deposit", account: { name: "Checking" } },
      { id: "tx-2", amount: -25, type: "withdrawal", account: { name: "Checking" } },
    ])

    const txs = await getRecentTransactions()
    expect(txs).toHaveLength(2)
    expect(txs[0].amount).toBe(50)
    expect(txs[1].amount).toBe(-25)
  })

  it("defaults to limit of 5", async () => {
    prismaMock.transaction.findMany.mockResolvedValue([])
    await getRecentTransactions()

    expect(prismaMock.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    )
  })

  it("accepts custom limit", async () => {
    prismaMock.transaction.findMany.mockResolvedValue([])
    await getRecentTransactions(10)

    expect(prismaMock.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 })
    )
  })
})

describe("getStakingSummary", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue(mockSession)
  })

  it("returns zeroed summary when not authenticated", async () => {
    authMock.mockResolvedValue(null)
    const summary = await getStakingSummary()
    expect(summary).toEqual({
      stakedBalance: 0,
      earnedTotal: 0,
      weightedApy: 0,
      positions: [],
    })
  })

  it("returns zeroed summary when no positions", async () => {
    prismaMock.stakingPosition.findMany.mockResolvedValue([])
    const summary = await getStakingSummary()
    expect(summary.stakedBalance).toBe(0)
    expect(summary.earnedTotal).toBe(0)
    expect(summary.weightedApy).toBe(0)
    expect(summary.positions).toEqual([])
  })

  it("calculates weighted APY correctly", async () => {
    prismaMock.stakingPosition.findMany.mockResolvedValue([
      { id: "s-1", amount: 1000, earned: 50, apy: 5, status: "active" },
      { id: "s-2", amount: 3000, earned: 200, apy: 8, status: "active" },
    ])

    const summary = await getStakingSummary()
    expect(summary.stakedBalance).toBe(4000)
    expect(summary.earnedTotal).toBe(250)
    // weighted APY: (5*1000 + 8*3000) / 4000 = 29000/4000 = 7.25
    expect(summary.weightedApy).toBe(7.25)
    expect(summary.positions).toHaveLength(2)
  })

  it("only fetches active positions", async () => {
    prismaMock.stakingPosition.findMany.mockResolvedValue([])
    await getStakingSummary()

    expect(prismaMock.stakingPosition.findMany).toHaveBeenCalledWith({
      where: { userId: "test-user-id", status: "active" },
    })
  })
})
