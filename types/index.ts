// User Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatarUrl?: string;
  accountType: 'family' | 'business';
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  notifications: {
    push: boolean;
    email: boolean;
    transactions: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
  };
}

// Account Types
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'child' | 'employee' | 'custom';
  walletAddress: string;
  balance: number;
  status: 'active' | 'frozen';
  avatarUrl?: string;
  controls: AccountControls;
  createdAt: Date;
}

export interface AccountControls {
  dailyLimit?: number;
  weeklyLimit?: number;
  monthlyLimit?: number;
  allowTransfers: boolean;
  allowExternalSends: boolean;
  blockedCategories: string[];
}

// Transaction Types
export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'stake' | 'unstake';
  amount: number;
  currency: string;
  merchant?: string;
  category?: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  createdAt: Date;
}

// Card Types
export interface Card {
  id: string;
  accountId: string;
  type: 'virtual' | 'physical';
  last4: string;
  status: 'active' | 'locked' | 'cancelled';
  spendingLimit?: number;
  expiryDate: string;
  createdAt: Date;
}

// Staking Types
export interface StakingPosition {
  id: string;
  userId: string;
  amount: number;
  apy: number;
  earnedTotal: number;
  earnedThisMonth: number;
  startedAt: Date;
  lastYieldAt: Date;
}

// Task Types (Chores)
export interface Task {
  id: string;
  createdBy: string;
  assignedTo: string;
  name: string;
  description?: string;
  rewardAmount: number;
  dueDate?: Date;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  verificationPhoto?: string;
  completedAt?: Date;
}

// Form/Action Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface CreateAccountData {
  name: string;
  type: 'child' | 'employee' | 'custom';
  initialFunding?: number;
  avatarUrl?: string;
  controls?: Partial<AccountControls>;
}

export interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
}

export interface TransactionFilters {
  accountId?: string;
  type?: Transaction['type'];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}
