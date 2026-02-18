import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { toNumber } from "@/lib/serialize"
import { isDemoMode, demoUnstake } from "@/lib/demo-data"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (isDemoMode()) {
      const result = demoUnstake(id)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 })
      }
      return NextResponse.json({ id, status: "completed" })
    }

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const position = await prisma.stakingPosition.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!position) {
      return NextResponse.json(
        { error: "Staking position not found" },
        { status: 404 }
      )
    }

    const updated = await prisma.stakingPosition.update({
      where: { id },
      data: { status: "completed" },
    })

    return NextResponse.json({
      ...updated,
      amount: toNumber(updated.amount),
      earned: toNumber(updated.earned),
      apy: toNumber(updated.apy),
    })
  } catch (error) {
    console.error("Staking update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
