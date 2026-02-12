import { describe, it, expect } from "vitest"
import {
  hashPassword,
  verifyPassword,
  validatePassword,
} from "@/lib/password"

describe("hashPassword & verifyPassword", () => {
  it("hashes and verifies a password", async () => {
    const password = "MySecure@Pass1"
    const hash = await hashPassword(password)

    expect(hash).not.toBe(password)
    expect(await verifyPassword(password, hash)).toBe(true)
  })

  it("rejects wrong password", async () => {
    const hash = await hashPassword("Correct@Pass1")
    expect(await verifyPassword("Wrong@Pass1", hash)).toBe(false)
  })

  it("produces different hashes for same password", async () => {
    const password = "Same@Pass123"
    const hash1 = await hashPassword(password)
    const hash2 = await hashPassword(password)
    expect(hash1).not.toBe(hash2)
  })
})

describe("validatePassword", () => {
  it("accepts a strong password", () => {
    const result = validatePassword("MyStr0ng@Pass")
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it("rejects short passwords", () => {
    const result = validatePassword("Ab1@")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      "Password must be at least 8 characters"
    )
  })

  it("requires uppercase", () => {
    const result = validatePassword("lowercase1@pass")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      "Password must contain at least one uppercase letter"
    )
  })

  it("requires lowercase", () => {
    const result = validatePassword("UPPERCASE1@PASS")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      "Password must contain at least one lowercase letter"
    )
  })

  it("requires a number", () => {
    const result = validatePassword("NoNumbers@Here")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      "Password must contain at least one number"
    )
  })

  it("requires a special character", () => {
    const result = validatePassword("NoSpecial1Here")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      "Password must contain at least one special character"
    )
  })

  it("collects all errors at once", () => {
    const result = validatePassword("short")
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(3)
  })
})
