import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    // Check waitlist approval before allowing registration
    const waitlistEntry = await prisma.waitlist.findUnique({
      where: { email },
    })

    if (!waitlistEntry || waitlistEntry.status !== "approved") {
      return NextResponse.json(
        { error: "This email hasn't been approved yet. Please join the waitlist first." },
        { status: 403 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Create Supabase auth user
    const { data: supabaseUser, error: supabaseError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (supabaseError || !supabaseUser.user) {
      console.error("Supabase user creation error:", supabaseError)
      return NextResponse.json(
        { error: "Failed to create auth account" },
        { status: 500 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        accountType: "family",
        supabaseAuthId: supabaseUser.user.id,
      },
    })

    await prisma.subAccount.create({
      data: {
        userId: user.id,
        name: "Main Account",
        type: "checking",
        balance: 0,
        currency: "USD",
      },
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
