import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db"
import { isDemoMode, demoUser } from "@/lib/demo-data"

export interface AppSession {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    accountType: string
    walletAddress?: string
    onboardingComplete?: boolean
  }
}

export async function auth(): Promise<AppSession | null> {
  if (isDemoMode()) {
    return {
      user: {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        image: demoUser.image,
        accountType: demoUser.accountType,
        walletAddress: demoUser.walletAddress,
        onboardingComplete: demoUser.onboardingComplete,
      },
    }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser) return null

    const user = await prisma.user.findUnique({
      where: { supabaseAuthId: supabaseUser.id },
    })

    if (!user) return null

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        accountType: user.accountType,
        walletAddress: user.walletAddress ?? undefined,
        onboardingComplete: user.onboardingComplete,
      },
    }
  } catch {
    return null
  }
}
