import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { isDemoMode, getDemoAccounts, createDemoAccount } from "@/lib/demo-data"

export async function GET() {
  try {
    if (isDemoMode()) {
      return NextResponse.json(getDemoAccounts())
    }

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accounts = await prisma.subAccount.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Accounts fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    if (isDemoMode()) {
      const body = await request.json()
      const account = createDemoAccount(body)
      return NextResponse.json(account, { status: 201 })
    }

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const account = await prisma.subAccount.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error("Account creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
