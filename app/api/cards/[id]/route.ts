import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { toNumber } from "@/lib/serialize"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { status } = await request.json()

    if (status !== "active" && status !== "locked") {
      return NextResponse.json(
        { error: "Status must be 'active' or 'locked'" },
        { status: 400 }
      )
    }

    const card = await prisma.card.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    const updated = await prisma.card.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({
      ...updated,
      spendingLimit: toNumber(updated.spendingLimit),
      currentSpending: toNumber(updated.currentSpending),
    })
  } catch (error) {
    console.error("Card update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
