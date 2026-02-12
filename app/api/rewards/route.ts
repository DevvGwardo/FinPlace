import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rewards = await prisma.reward.findMany({
      where: { userId: session.user.id },
      orderBy: { unlockedAt: "desc" },
    })

    return NextResponse.json(rewards)
  } catch (error) {
    console.error("Rewards fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
