import { NextResponse } from "next/server"
import type { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { toNumber } from "@/lib/serialize"
import {
  isDemoMode,
  getDemoTransactions,
  demoCreateTransaction,
} from "@/lib/demo-data"

export async function GET(request: Request) {
  try {
    if (isDemoMode()) {
      const { searchParams } = new URL(request.url)
      const type = searchParams.get("type") || undefined
      return NextResponse.json(getDemoTransactions(type))
    }

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const where: Prisma.TransactionWhereInput = { userId: session.user.id }
    if (type) {
      where.type = type
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { account: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    })

    const serialized = transactions.map((tx) => ({
      ...tx,
      amount: toNumber(tx.amount),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Transactions fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (isDemoMode()) {
      const result = demoCreateTransaction(body)
      if (!result.success) {
        const status = result.error === "Insufficient balance" ? 400 : 404
        return NextResponse.json({ error: result.error }, { status })
      }
      return NextResponse.json(result.transaction, { status: 201 })
    }

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
