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

    const task = await prisma.task.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const data: Record<string, any> = { status }
    if (status === "approved") {
      data.completedAt = new Date()
    }

    const updated = await prisma.task.update({
      where: { id },
      data,
    })

    return NextResponse.json({
      ...updated,
      reward: toNumber(updated.reward),
    })
  } catch (error) {
    console.error("Task update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
