import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  cn,
  formatCurrency,
  formatCompactNumber,
  shortenAddress,
  getInitials,
  formatDate,
  formatRelativeTime,
} from "@/lib/utils"

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("filters out falsy values", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar")
  })

  it("returns empty string with no args", () => {
    expect(cn()).toBe("")
  })
})

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56")
  })

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00")
  })

  it("formats negative amounts", () => {
    expect(formatCurrency(-50)).toBe("-$50.00")
  })

  it("rounds to two decimal places", () => {
    expect(formatCurrency(10.999)).toBe("$11.00")
  })

  it("supports other currencies", () => {
    const result = formatCurrency(100, "EUR")
    expect(result).toContain("100")
  })
})

describe("formatCompactNumber", () => {
  it("returns plain number below 1000", () => {
    expect(formatCompactNumber(500)).toBe("500")
  })

  it("formats thousands", () => {
    expect(formatCompactNumber(1500)).toBe("1.5K")
  })

  it("formats millions", () => {
    expect(formatCompactNumber(2500000)).toBe("2.5M")
  })

  it("formats billions", () => {
    expect(formatCompactNumber(3000000000)).toBe("3.0B")
  })

  it("handles exact boundaries", () => {
    expect(formatCompactNumber(1000)).toBe("1.0K")
    expect(formatCompactNumber(1000000)).toBe("1.0M")
    expect(formatCompactNumber(1000000000)).toBe("1.0B")
  })
})

describe("shortenAddress", () => {
  it("shortens a wallet address", () => {
    const address = "0x1234567890abcdef1234567890abcdef12345678"
    expect(shortenAddress(address)).toBe("0x1234...5678")
  })

  it("supports custom char count", () => {
    const address = "0x1234567890abcdef1234567890abcdef12345678"
    expect(shortenAddress(address, 6)).toBe("0x123456...345678")
  })
})

describe("getInitials", () => {
  it("returns initials from full name", () => {
    expect(getInitials("John Doe")).toBe("JD")
  })

  it("handles single name", () => {
    expect(getInitials("John")).toBe("J")
  })

  it("caps at 2 characters", () => {
    expect(getInitials("John Michael Doe")).toBe("JM")
  })

  it("uppercases initials", () => {
    expect(getInitials("john doe")).toBe("JD")
  })
})

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns 'Just now' for less than a minute ago", () => {
    const date = new Date("2025-06-15T11:59:45Z")
    expect(formatRelativeTime(date)).toBe("Just now")
  })

  it("returns minutes ago", () => {
    const date = new Date("2025-06-15T11:45:00Z")
    expect(formatRelativeTime(date)).toBe("15m ago")
  })

  it("returns hours ago", () => {
    const date = new Date("2025-06-15T09:00:00Z")
    expect(formatRelativeTime(date)).toBe("3h ago")
  })

  it("returns days ago", () => {
    const date = new Date("2025-06-13T12:00:00Z")
    expect(formatRelativeTime(date)).toBe("2d ago")
  })

  it("falls back to formatDate after 7 days", () => {
    const date = new Date("2025-06-01T12:00:00Z")
    const result = formatRelativeTime(date)
    expect(result).toContain("Jun")
    expect(result).toContain("2025")
  })

  it("accepts string dates", () => {
    expect(formatRelativeTime("2025-06-15T11:50:00Z")).toBe("10m ago")
  })
})

describe("formatDate", () => {
  it("formats a Date object", () => {
    const date = new Date("2025-01-15T12:00:00Z")
    const result = formatDate(date)
    expect(result).toContain("Jan")
    expect(result).toContain("15")
    expect(result).toContain("2025")
  })

  it("formats a date string", () => {
    const result = formatDate("2025-06-01")
    expect(result).toContain("2025")
  })
})
