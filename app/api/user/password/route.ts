import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import bcrypt from "bcryptjs"

export async function PATCH(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, supabaseAuthId: true },
    })

    if (!user?.password) {
      return NextResponse.json(
        { error: "No password set for this account" },
        { status: 400 }
      )
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    // Sync password to Supabase
    if (user.supabaseAuthId) {
      await supabaseAdmin.auth.admin.updateUserById(user.supabaseAuthId, {
        password: newPassword,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
