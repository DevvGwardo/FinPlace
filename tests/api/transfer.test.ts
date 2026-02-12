import { describe, it, expect, beforeEach, vi } from "vitest"
import { prismaMock } from "../mocks/prisma"
import { authMock } from "../mocks/auth"
import { POST } from "@/app/api/transfer/route"

describe("POST /api/transfer", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue({
      user: { id: "test-user-id", name: "Test User", email: "user@test.com" },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
  })

  it("returns 401 when not authenticated", async () => {
    authMock.mockResolvedValue(null)

    const req = new Request("http://localhost/api/transfer", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        amount: 50,
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it("returns 404 when source account not found", async () => {
    prismaMock.subAccount.findFirst.mockResolvedValueOnce(null)

    const req = new Request("http://localhost/api/transfer", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "nonexistent",
        toAccountId: "acc-2",
        amount: 50,
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: "Source account not found" })
  })

  it("returns 404 when destination account not found", async () => {
    prismaMock.subAccount.findFirst
      .mockResolvedValueOnce({ id: "acc-1", balance: 100, userId: "test-user-id" })
      .mockResolvedValueOnce(null)

    const req = new Request("http://localhost/api/transfer", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "acc-1",
        toAccountId: "nonexistent",
        amount: 50,
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: "Destination account not found" })
  })

  it("returns 400 for insufficient balance", async () => {
    prismaMock.subAccount.findFirst
      .mockResolvedValueOnce({ id: "acc-1", balance: 30, userId: "test-user-id", name: "Checking" })
      .mockResolvedValueOnce({ id: "acc-2", balance: 100, userId: "test-user-id", name: "Savings" })

    const req = new Request("http://localhost/api/transfer", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        amount: 50,
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: "Insufficient balance" })
  })

  it("creates correct transaction records on success", async () => {
    prismaMock.subAccount.findFirst
      .mockResolvedValueOnce({ id: "acc-1", balance: 500, userId: "test-user-id", name: "Checking" })
      .mockResolvedValueOnce({ id: "acc-2", balance: 100, userId: "test-user-id", name: "Savings" })
    prismaMock.$transaction.mockResolvedValue([])

    const req = new Request("http://localhost/api/transfer", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        amount: 100,
      }),
    })

    await POST(req)

    // Verify the transaction array passed to prisma.$transaction
    const txArgs = prismaMock.$transaction.mock.calls[0][0]
    expect(txArgs).toHaveLength(4) // 2 balance updates + 2 transaction records
  })

  it("handles exact balance transfer (drain account)", async () => {
    prismaMock.subAccount.findFirst
      .mockResolvedValueOnce({ id: "acc-1", balance: 100, userId: "test-user-id", name: "Checking" })
      .mockResolvedValueOnce({ id: "acc-2", balance: 0, userId: "test-user-id", name: "Savings" })
    prismaMock.$transaction.mockResolvedValue([])

    const req = new Request("http://localhost/api/transfer", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        amount: 100,
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
  })

  it("returns 500 when database transaction fails", async () => {
    prismaMock.subAccount.findFirst
      .mockResolvedValueOnce({ id: "acc-1", balance: 500, userId: "test-user-id", name: "Checking" })
      .mockResolvedValueOnce({ id: "acc-2", balance: 100, userId: "test-user-id", name: "Savings" })
    prismaMock.$transaction.mockRejectedValue(new Error("DB error"))

    const req = new Request("http://localhost/api/transfer", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        amount: 50,
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: "Internal server error" })
  })

  it("performs a successful transfer", async () => {
    prismaMock.subAccount.findFirst
      .mockResolvedValueOnce({ id: "acc-1", balance: 200, userId: "test-user-id", name: "Checking" })
      .mockResolvedValueOnce({ id: "acc-2", balance: 50, userId: "test-user-id", name: "Savings" })
    prismaMock.$transaction.mockResolvedValue([])

    const req = new Request("http://localhost/api/transfer", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        amount: 75,
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(prismaMock.$transaction).toHaveBeenCalledOnce()
  })
})
