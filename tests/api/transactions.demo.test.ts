import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { GET as getAccounts } from "@/app/api/accounts/route"
import { GET as getTransactions, POST as createTransaction } from "@/app/api/transactions/route"

describe("Demo mode transaction charging", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = "true"
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = "false"
  })

  it("charges the selected sub-account and records receipt transaction data", async () => {
    const accountsBeforeRes = await getAccounts()
    const accountsBefore = await accountsBeforeRes.json()
    const target = accountsBefore[0]
    const startingBalance = Number(target.balance)

    const chargeAmount = 19.95
    const createRes = await createTransaction(
      new Request("http://localhost/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          accountId: target.id,
          type: "withdrawal",
          amount: -chargeAmount,
          description: "Coffee Shop",
          category: "Food & Drink",
          counterparty: "Coffee Shop",
          metadata: {
            isReceipt: true,
            merchant: "Coffee Shop",
          },
        }),
      })
    )

    expect(createRes.status).toBe(201)

    const accountsAfterRes = await getAccounts()
    const accountsAfter = await accountsAfterRes.json()
    const updated = accountsAfter.find((a: { id: string }) => a.id === target.id)
    expect(Number(updated.balance)).toBeCloseTo(startingBalance - chargeAmount, 2)

    const transactionsRes = await getTransactions(
      new Request("http://localhost/api/transactions")
    )
    const transactions = await transactionsRes.json()
    const created = transactions.find((tx: { description?: string }) => tx.description === "Coffee Shop")

    expect(created).toBeDefined()
    expect(created.accountId).toBe(target.id)
    expect(created.metadata?.isReceipt).toBe(true)
  })
})
