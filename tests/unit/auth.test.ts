import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock next/navigation before importing auth functions
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

import { authMock, mockSession } from "../mocks/auth"
import {
  getSession,
  getCurrentUser,
  requireAuth,
  requireGuest,
  isAuthenticated,
} from "@/lib/auth"
import { redirect } from "next/navigation"

describe("getSession", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue(mockSession)
  })

  it("returns the session when authenticated", async () => {
    const session = await getSession()
    expect(session).toEqual(mockSession)
  })

  it("returns null when not authenticated", async () => {
    authMock.mockResolvedValue(null)
    const session = await getSession()
    expect(session).toBeNull()
  })
})

describe("getCurrentUser", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue(mockSession)
  })

  it("returns the user when authenticated", async () => {
    const user = await getCurrentUser()
    expect(user).toEqual(mockSession.user)
  })

  it("returns undefined when not authenticated", async () => {
    authMock.mockResolvedValue(null)
    const user = await getCurrentUser()
    expect(user).toBeUndefined()
  })
})

describe("requireAuth", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue(mockSession)
  })

  it("returns the user when authenticated", async () => {
    const user = await requireAuth()
    expect(user).toEqual(mockSession.user)
  })

  it("redirects to /login when not authenticated", async () => {
    authMock.mockResolvedValue(null)
    await expect(requireAuth()).rejects.toThrow("REDIRECT:/login")
    expect(redirect).toHaveBeenCalledWith("/login")
  })

  it("redirects when session has no user", async () => {
    authMock.mockResolvedValue({ user: null })
    await expect(requireAuth()).rejects.toThrow("REDIRECT:/login")
  })
})

describe("requireGuest", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue(mockSession)
  })

  it("redirects to /dashboard when authenticated", async () => {
    await expect(requireGuest()).rejects.toThrow("REDIRECT:/dashboard")
    expect(redirect).toHaveBeenCalledWith("/dashboard")
  })

  it("does nothing when not authenticated", async () => {
    authMock.mockResolvedValue(null)
    await expect(requireGuest()).resolves.toBeUndefined()
  })
})

describe("isAuthenticated", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    authMock.mockResolvedValue(mockSession)
  })

  it("returns true when authenticated", async () => {
    expect(await isAuthenticated()).toBe(true)
  })

  it("returns false when not authenticated", async () => {
    authMock.mockResolvedValue(null)
    expect(await isAuthenticated()).toBe(false)
  })

  it("returns false when session has no user", async () => {
    authMock.mockResolvedValue({ user: null })
    expect(await isAuthenticated()).toBe(false)
  })
})
