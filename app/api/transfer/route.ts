import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { toNumber } from "@/lib/serialize"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fromAccountId, toAccountId, amount, note } = await request.json()

    const fromAccount = await prisma.subAccount.findFirst({
      where: { id: fromAccountId, userId: session.user.id },
    })

    if (!fromAccount) {
      return NextResponse.json(
        { error: "Source account not found" },
        { status: 404 }
      )
    }

    const toAccount = await prisma.subAccount.findFirst({
      where: { id: toAccountId, userId: session.user.id },
    })

    if (!toAccount) {
      return NextResponse.json(
        { error: "Destination account not found" },
        { status: 404 }
      )
    }

    if (toNumber(fromAccount.balance) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    await prisma.$transaction([
      prisma.subAccount.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount } },
      }),
      prisma.subAccount.update({
        where: { id: toAccountId },
        data: { balance: { increment: amount } },
      }),
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          accountId: fromAccountId,
          type: "transfer",
          amount: -amount,
          description: "Transfer to " + toAccount.name,
          category: "Transfer",
          status: "completed",
        },
      }),
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          accountId: toAccountId,
          type: "transfer",
          amount: amount,
          description: "Transfer from " + fromAccount.name,
          category: "Transfer",
          status: "completed",
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Transfer error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
