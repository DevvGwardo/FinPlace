import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

export async function PATCH(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updates: Record<string, unknown> = {}

    if (body.accountType !== undefined) {
      if (body.accountType !== "family" && body.accountType !== "business") {
        return NextResponse.json(
          { error: "accountType must be 'family' or 'business'" },
          { status: 400 }
        )
      }
      updates.accountType = body.accountType
    }

    if (body.onboardingComplete !== undefined) {
      updates.onboardingComplete = body.onboardingComplete
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { ...updates },
    })

    // Sync onboardingComplete to Supabase user_metadata so middleware can read it
    if (body.onboardingComplete !== undefined && user.supabaseAuthId) {
      await supabaseAdmin.auth.admin.updateUserById(user.supabaseAuthId, {
        user_metadata: { onboardingComplete: user.onboardingComplete },
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Onboarding update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
