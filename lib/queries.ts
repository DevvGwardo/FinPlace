import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { toNumber } from "@/lib/serialize"

export async function getTotalBalance(): Promise<number> {
  const session = await auth()
  if (!session?.user?.id) return 0

  const result = await prisma.subAccount.aggregate({
    where: { userId: session.user.id },
    _sum: { balance: true },
  })

  return toNumber(result._sum.balance)
}

export async function getSubAccounts() {
  const session = await auth()
  if (!session?.user?.id) return []

  const accounts = await prisma.subAccount.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return accounts.map((account) => ({
    ...account,
    balance: toNumber(account.balance),
  }))
}

export async function getRecentTransactions(limit = 5) {
  const session = await auth()
  if (!session?.user?.id) return []

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { account: { select: { name: true } } },
  })

  return transactions.map((tx) => ({
    ...tx,
    amount: toNumber(tx.amount),
  }))
}

export async function getStakingSummary() {
  const session = await auth()
  if (!session?.user?.id) {
    return { stakedBalance: 0, earnedTotal: 0, weightedApy: 0, positions: [] }
  }

  const positions = await prisma.stakingPosition.findMany({
    where: { userId: session.user.id, status: "active" },
  })

  let stakedBalance = 0
  let earnedTotal = 0
  let weightedApySum = 0

  const serialized = positions.map((pos) => {
    const amount = toNumber(pos.amount)
    const earned = toNumber(pos.earned)
    const apy = toNumber(pos.apy)

    stakedBalance += amount
    earnedTotal += earned
    weightedApySum += apy * amount

    return {
      ...pos,
      amount,
      earned,
      apy,
    }
  })

  const weightedApy = stakedBalance > 0 ? weightedApySum / stakedBalance : 0

  return {
    stakedBalance,
    earnedTotal,
    weightedApy,
    positions: serialized,
  }
}
