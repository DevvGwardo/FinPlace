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

    const positions = await prisma.stakingPosition.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    let stakedBalance = 0
    let earnedTotal = 0
    let weightedApySum = 0

    const serialized = positions.map((pos) => {
      const amount = toNumber(pos.amount)
      const earned = toNumber(pos.earned)
      const apy = toNumber(pos.apy)

      if (pos.status === "active") {
        stakedBalance += amount
        weightedApySum += apy * amount
      }
      earnedTotal += earned

      return {
        ...pos,
        amount,
        earned,
        apy,
      }
    })

    const weightedApy = stakedBalance > 0 ? weightedApySum / stakedBalance : 0

    return NextResponse.json({
      stakedBalance,
      earnedTotal,
      weightedApy,
      positions: serialized,
    })
  } catch (error) {
    console.error("Staking fetch error:", error)
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

    const { asset, amount, apy, lockPeriod } = await request.json()

    const now = new Date()
    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + lockPeriod)

    const position = await prisma.stakingPosition.create({
      data: {
        userId: session.user.id,
        asset,
        amount,
        apy,
        lockPeriod,
        startDate: now,
        endDate,
        status: "active",
        earned: 0,
      },
    })

    return NextResponse.json(position, { status: 201 })
  } catch (error) {
    console.error("Staking creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
