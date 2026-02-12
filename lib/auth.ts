import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function getSession() {
  const session = await auth()
  return session
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return session.user
}

export async function requireGuest() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }
}

export async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}
