import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { isDemoMode, demoFund } from "@/lib/demo-data"

export async function POST(request: Request) {
  try {
    const { accountId, amount, source } = await request.json()

    if (isDemoMode()) {
      const result = demoFund(accountId, amount, source || "external")
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const account = await prisma.subAccount.findFirst({
      where: { id: accountId, userId: session.user.id },
    })

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      )
    }

    await prisma.$transaction([
      prisma.subAccount.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      }),
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          accountId,
          type: "deposit",
          amount,
          description: "Deposit from " + (source || "external"),
          category: "Deposit",
          status: "completed",
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fund error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
