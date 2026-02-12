import { describe, it, expect } from "vitest"
import { toNumber } from "@/lib/serialize"

describe("toNumber", () => {
  it("returns 0 for null", () => {
    expect(toNumber(null)).toBe(0)
  })

  it("returns 0 for undefined", () => {
    expect(toNumber(undefined)).toBe(0)
  })

  it("passes through numbers", () => {
    expect(toNumber(42)).toBe(42)
    expect(toNumber(3.14)).toBe(3.14)
  })

  it("handles objects with toNumber()", () => {
    const decimal = { toNumber: () => 99.5 }
    expect(toNumber(decimal)).toBe(99.5)
  })

  it("converts numeric strings", () => {
    expect(toNumber("123")).toBe(123)
    expect(toNumber("45.67")).toBe(45.67)
  })

  it("returns 0 for non-numeric strings", () => {
    expect(toNumber("abc")).toBe(0)
  })

  it("returns 0 for NaN-producing values", () => {
    expect(toNumber({})).toBe(0)
  })
})
