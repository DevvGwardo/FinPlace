import { vi } from "vitest"

export const prismaMock = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  subAccount: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    aggregate: vi.fn(),
  },
  transaction: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  stakingPosition: {
    findMany: vi.fn(),
  },
  waitlist: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  $transaction: vi.fn(),
}

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
}))
