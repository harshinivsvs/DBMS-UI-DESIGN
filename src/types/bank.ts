export type UserRole = 'customer' | 'teller' | 'manager' | 'admin';

export type PublicPage = 'landing' | 'login' | 'register' | 'about' | 'contact';

export type CustomerTab =
  | 'customer_dashboard'
  | 'my_accounts'
  | 'balance_overview'
  | 'money_transfer'
  | 'transaction_history'
  | 'account_statement'
  | 'loan_status'
  | 'notifications'
  | 'profile'
  | 'settings';

export type TellerTab =
  | 'teller_dashboard'
  | 'customer_search'
  | 'deposit'
  | 'withdrawal'
  | 'cheque_clearing'
  | 'transaction_queue'
  | 'daily_transactions'
  | 'settings';

export type ManagerTab =
  | 'manager_dashboard'
  | 'branch_liquidity'
  | 'loan_approval'
  | 'branch_metrics'
  | 'manager_reports'
  | 'settings';

export type AdminTab =
  | 'admin_dashboard'
  | 'user_management'
  | 'role_management'
  | 'audit_logs'
  | 'database_health'
  | 'database_backup'
  | 'settings';

export type ActiveTab = CustomerTab | TellerTab | ManagerTab | AdminTab;
export type NavigationTab = ActiveTab | string;

export type AccountType = 'Savings' | 'Checking' | 'Investment' | 'Money Market' | 'Current' | 'Fixed Deposit';
export type AccountStatus = 'Active' | 'Dormant' | 'Frozen' | 'Closed';

export interface Customer {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  accountNumber: string;
  accountType: AccountType;
  branch: string;
  status: 'Verified' | 'Pending KYC' | 'Flagged';
  totalBalance: number;
  creditScore: number;
  joinedDate: string;
  avatar: string;
  role?: UserRole;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  iban: string;
  customerName: string;
  type: AccountType;
  balance: number;
  currency: string;
  interestRate: number;
  status: AccountStatus;
  branch: string;
  openedDate: string;
}

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'In Review';
export type TransactionType = 'Deposit' | 'Withdrawal' | 'Transfer' | 'Cheque' | 'SWIFT Transfer' | 'Wire Transfer';

export interface Transaction {
  id: string;
  referenceNumber: string;
  senderName: string;
  senderIban: string;
  receiverName: string;
  receiverIban: string;
  amount: number;
  currency: string;
  date: string;
  time: string;
  type: TransactionType;
  status: TransactionStatus;
  branch: string;
  category: string;
  fee: number;
  description?: string;
  tellerId?: string;
}

export interface LoanApplication {
  id: string;
  customerName: string;
  customerId: string;
  loanType: 'Personal Loan' | 'Home Mortgage' | 'Business Expansion' | 'Auto Loan';
  amount: number;
  interestRate: number;
  termMonths: number;
  emi: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
  appliedDate: string;
  creditScore: number;
}

export interface ChequeItem {
  id: string;
  chequeNumber: string;
  bankName: string;
  drawerName: string;
  payeeName: string;
  accountNumber: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  image: string;
  rejectionReason?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  affectedTable: string;
  oldValue: string;
  newValue: string;
  status: 'Success' | 'Failed';
}

export interface SysUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  branch: string;
  status: 'Active' | 'Inactive' | 'Locked';
  lastLogin: string;
  permissions: string[];
}

export interface DbHealthMetric {
  status: 'Healthy' | 'Degraded' | 'Critical';
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  activeConnections: number;
  backupStatus: 'Up-to-Date' | 'Scheduled' | 'Failed';
  triggerCount: number;
  replicationLagMs: number;
}

export interface BranchMetric {
  branchName: string;
  vaultLiquidity: number;
  totalDeposits: number;
  totalLoans: number;
  activeCustomers: number;
  reserveRatio: number;
  monthlyRevenue: number;
}

export interface BackupRecord {
  id: string;
  filename: string;
  timestamp: string;
  sizeMb: number;
  type: 'Automated' | 'Manual' | 'Snapshot';
  status: 'Completed' | 'In Progress' | 'Restored';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
  category: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
