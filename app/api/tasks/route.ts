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

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    const serialized = tasks.map((task) => ({
      ...task,
      reward: toNumber(task.reward),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Tasks fetch error:", error)
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

    const { title, description, reward, assignedTo, dueDate } =
      await request.json()

    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        title,
        reward,
        ...(description !== undefined && { description }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Task creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
