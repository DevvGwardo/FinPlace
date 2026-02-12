import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { toNumber } from "@/lib/serialize"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cards = await prisma.card.findMany({
      where: { userId: session.user.id },
      include: { account: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    })

    const serialized = cards.map((card) => ({
      ...card,
      spendingLimit: toNumber(card.spendingLimit),
      currentSpending: toNumber(card.currentSpending),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Cards fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { accountId, cardType } = await request.json()

    const account = await prisma.subAccount.findFirst({
      where: { id: accountId, userId: session.user.id },
    })

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      )
    }

    const cardNumber = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10)
    ).join("")

    const now = new Date()
    const expiryMonth = now.getMonth() + 1
    const expiryYear = now.getFullYear() + 3

    const card = await prisma.card.create({
      data: {
        userId: session.user.id,
        accountId,
        cardNumber,
        cardType,
        status: "active",
        currentSpending: 0,
        expiryMonth,
        expiryYear,
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error("Card creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
