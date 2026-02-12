import { vi } from "vitest"

export const mockSession = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    accountType: "family",
    onboardingComplete: true,
  },
}

// Use a separate reference so vi.mock hoisting works correctly
export let authMock = vi.fn()

vi.mock("@/auth", () => {
  const mock = vi.fn().mockResolvedValue(mockSession)
  // Keep our exported reference in sync
  authMock = mock
  return { auth: mock }
})
