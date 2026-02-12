import { describe, it, expect, beforeEach, vi } from "vitest"
import { prismaMock } from "../mocks/prisma"
import "../mocks/auth"

// Mock password hashing to speed up tests
vi.mock("@/lib/password", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed-password"),
  verifyPassword: vi.fn(),
  validatePassword: vi.fn(),
}))

// Mock Supabase admin client
const { mockCreateUser } = vi.hoisted(() => ({
  mockCreateUser: vi.fn(),
}))
vi.mock("@/lib/supabase/admin", () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: mockCreateUser,
      },
    },
  },
}))

import { POST } from "@/app/api/auth/register/route"

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockCreateUser.mockResolvedValue({
      data: { user: { id: "supabase-uid-123" } },
      error: null,
    })
  })

  it("rejects invalid email", async () => {
    const res = await POST(makeRequest({
      name: "Test User",
      email: "not-an-email",
      password: "Password1@",
    }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain("email")
  })

  it("rejects short name", async () => {
    const res = await POST(makeRequest({
      name: "A",
      email: "test@example.com",
      password: "Password1@",
    }))

    expect(res.status).toBe(400)
  })

  it("rejects short password", async () => {
    const res = await POST(makeRequest({
      name: "Test User",
      email: "test@example.com",
      password: "short",
    }))

    expect(res.status).toBe(400)
  })

  it("rejects email not on approved waitlist", async () => {
    prismaMock.waitlist.findUnique.mockResolvedValue(null)

    const res = await POST(makeRequest({
      name: "Test User",
      email: "new@example.com",
      password: "Password1@",
    }))

    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toContain("waitlist")
  })

  it("rejects pending waitlist entry", async () => {
    prismaMock.waitlist.findUnique.mockResolvedValue({
      email: "pending@example.com",
      status: "pending",
    })

    const res = await POST(makeRequest({
      name: "Test User",
      email: "pending@example.com",
      password: "Password1@",
    }))

    expect(res.status).toBe(403)
  })

  it("rejects duplicate user", async () => {
    prismaMock.waitlist.findUnique.mockResolvedValue({
      email: "existing@example.com",
      status: "approved",
    })
    prismaMock.user.findUnique.mockResolvedValue({
      id: "existing-id",
      email: "existing@example.com",
    })

    const res = await POST(makeRequest({
      name: "Test User",
      email: "existing@example.com",
      password: "Password1@",
    }))

    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({ error: "User already exists" })
  })

  it("creates user and default account on success", async () => {
    prismaMock.waitlist.findUnique.mockResolvedValue({
      email: "approved@example.com",
      status: "approved",
    })
    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue({
      id: "new-user-id",
      name: "Test User",
      email: "approved@example.com",
    })
    prismaMock.subAccount.create.mockResolvedValue({})

    const res = await POST(makeRequest({
      name: "Test User",
      email: "approved@example.com",
      password: "Password1@",
    }))

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.userId).toBe("new-user-id")

    // Verify a default sub-account was created
    expect(prismaMock.subAccount.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "new-user-id",
        name: "Main Account",
        type: "checking",
        balance: 0,
      }),
    })
  })
})
