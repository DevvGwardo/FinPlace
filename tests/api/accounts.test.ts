import { describe, it, expect, beforeEach, vi } from "vitest"
import { prismaMock } from "../mocks/prisma"
import { authMock } from "../mocks/auth"
import { GET, POST } from "@/app/api/accounts/route"

describe("/api/accounts", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue({
      user: { id: "test-user-id", name: "Test User", email: "user@test.com" },
      expires: new Date(Date.now() + 86400000).toISOString(),
    })
  })

  describe("GET", () => {
    it("returns 401 when not authenticated", async () => {
      authMock.mockResolvedValue(null)

      const res = await GET()
      expect(res.status).toBe(401)
    })

    it("returns user accounts", async () => {
      const mockAccounts = [
        { id: "acc-1", name: "Checking", type: "checking", balance: 500, currency: "USD" },
        { id: "acc-2", name: "Savings", type: "savings", balance: 1200, currency: "USD" },
      ]
      prismaMock.subAccount.findMany.mockResolvedValue(mockAccounts)

      const res = await GET()
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveLength(2)
      expect(data[0].name).toBe("Checking")
      expect(data[1].name).toBe("Savings")
    })

    it("returns empty array when no accounts", async () => {
      prismaMock.subAccount.findMany.mockResolvedValue([])

      const res = await GET()
      const data = await res.json()
      expect(data).toEqual([])
    })
  })

  describe("POST", () => {
    it("returns 401 when not authenticated", async () => {
      authMock.mockResolvedValue(null)

      const req = new Request("http://localhost/api/accounts", {
        method: "POST",
        body: JSON.stringify({ name: "New Account", type: "savings" }),
      })

      const res = await POST(req)
      expect(res.status).toBe(401)
    })

    it("creates a new account", async () => {
      const newAccount = {
        id: "acc-new",
        name: "Kids Account",
        type: "checking",
        balance: 0,
        currency: "USD",
        userId: "test-user-id",
      }
      prismaMock.subAccount.create.mockResolvedValue(newAccount)

      const req = new Request("http://localhost/api/accounts", {
        method: "POST",
        body: JSON.stringify({
          name: "Kids Account",
          type: "checking",
          balance: 0,
          currency: "USD",
        }),
      })

      const res = await POST(req)
      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.name).toBe("Kids Account")
      expect(prismaMock.subAccount.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "test-user-id",
          name: "Kids Account",
        }),
      })
    })
  })
})
