import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Wallet,
  ArrowRight,
  ArrowLeftRight,
  Receipt,
  Scale,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  Download,
  Calendar,
  DollarSign,
  Calculator,
  PlusCircle,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { Customer, BankAccount, Transaction, LoanApplication } from '../../types/bank';

interface CustomerViewsProps {
  currentTab: string;
  currentUser: Customer;
  accounts: BankAccount[];
  transactions: Transaction[];
  loans: LoanApplication[];
  onOpenActionModal: (action: 'deposit' | 'withdraw' | 'transfer') => void;
  onSelectTab: (tab: any) => void;
  onShowToast: (title: string, desc: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onApplyLoan?: (loan: Partial<LoanApplication>) => void;
}

// ----------------------------------------------------------------------
// 1. BALANCE OVERVIEW COMPONENT
// ----------------------------------------------------------------------
export const BalanceOverviewView: React.FC<{
  accounts: BankAccount[];
  currentUser: Customer;
}> = ({ accounts, currentUser }) => {
  const userAccounts = accounts.filter((a) => a.customerName === currentUser.name) || accounts;

  const totalBalance = userAccounts.reduce((sum, a) => sum + a.balance, 0);

  const pieData = userAccounts.map((a) => ({
    name: `${a.type} (${a.accountNumber.slice(-4)})`,
    value: a.balance,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

  const monthlyYieldEstimate = userAccounts.reduce((sum, a) => {
    return sum + (a.balance * (a.interestRate / 100)) / 12;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E293B] border border-slate-700 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Portfolio Summary
            </span>
            <span className="text-xs text-slate-400 font-mono">User: {currentUser.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Balance & Yield Overview</h1>
          <p className="text-xs text-slate-300">
            Real-time balance aggregation across all linked savings, checking, and investment accounts.
          </p>
        </div>
        <div className="bg-slate-900/80 px-5 py-3 rounded-2xl border border-slate-700/80">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Aggregate Net Portfolio
          </p>
          <p className="text-2xl font-black text-emerald-400 font-mono-num">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Chart */}
        <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              Account Balance Distribution
            </h2>
            <span className="text-xs text-slate-400 font-mono">{userAccounts.length} Accounts</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Balance']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs bg-slate-900/50 p-2 rounded-xl">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-slate-300 truncate">{item.name}</span>
                <span className="ml-auto font-bold font-mono text-white">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Yield & APY Breakdown */}
        <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Interest Rates & Estimated APY Yield
            </h2>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Interest Accrual Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Estimated Monthly Interest Return</p>
              <p className="text-xl font-bold text-emerald-400 font-mono-num mt-0.5">
                +${monthlyYieldEstimate.toFixed(2)} USD / month
              </p>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-3">
            {userAccounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white">{acc.type} Account</p>
                  <p className="text-[10px] font-mono text-slate-400">{acc.accountNumber}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {acc.interestRate}% APY
                  </span>
                  <p className="text-sm font-bold text-white font-mono mt-1">
                    ${acc.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. ATOMIC TRANSACTION TRANSFER COMPONENT (COMMIT / ROLLBACK)
// ----------------------------------------------------------------------
export const AtomicTransferView: React.FC<{
  accounts: BankAccount[];
  currentUser: Customer;
  onShowToast: (title: string, desc: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}> = ({ accounts, currentUser, onShowToast }) => {
  const userAccounts = accounts.filter((a) => a.customerName === currentUser.name) || accounts;

  const [fromAccount, setFromAccount] = useState<string>(userAccounts[0]?.id || accounts[0]?.id || '');
  const [toIban, setToIban] = useState<string>('US89APEX900211824410');
  const [receiverName, setReceiverName] = useState<string>('Aisha Al-Mansoor');
  const [amount, setAmount] = useState<number>(2500);

  // Atomic state workflow
  const [stage, setStage] = useState<'idle' | 'begun' | 'validated' | 'staged' | 'committed' | 'rolledback'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const selectedSourceAcc = accounts.find((a) => a.id === fromAccount) || accounts[0];

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev]);
  };

  const handleBeginTxn = () => {
    setStage('begun');
    setLogs([]);
    addLog(`BEGIN TRANSACTION; -- Session #${Math.floor(Math.random() * 900000 + 100000)}`);
    addLog(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`);
  };

  const handleValidateConstraints = () => {
    if (amount <= 0) {
      addLog(`ERROR: Invalid amount $${amount}. Must be > 0.`);
      onShowToast('Validation Failed', 'Transfer amount must be greater than zero.', 'error');
      return;
    }
    if (selectedSourceAcc && selectedSourceAcc.balance < amount) {
      addLog(`CONSTRAINT FAILURE: Account balance $${selectedSourceAcc.balance} insufficient for $${amount}.`);
      onShowToast('Constraint Error', 'Insufficient balance for atomic debit.', 'error');
      return;
    }

    setStage('validated');
    addLog(`CHECK_CONSTRAINT: Source Account #${selectedSourceAcc?.accountNumber} balance verified ($${selectedSourceAcc?.balance}).`);
    addLog(`SELECT FOR UPDATE: Acquired row lock on account #${selectedSourceAcc?.accountNumber}.`);
    addLog(`VERIFY_DESTINATION: Receiver IBAN ${toIban} format valid.`);
  };

  const handleStageLedger = () => {
    setStage('staged');
    addLog(`STAGING DEBIT: -${amount} USD from #${selectedSourceAcc?.accountNumber}`);
    addLog(`STAGING CREDIT: +${amount} USD to IBAN ${toIban}`);
    addLog(`WAL_LOG: Write-Ahead Log entry created (Pending Commit).`);
  };

  const handleCommit = () => {
    if (selectedSourceAcc) {
      selectedSourceAcc.balance -= amount;
    }
    setStage('committed');
    addLog(`COMMIT TRANSACTION; -- All mutations successfully persisted to disk.`);
    addLog(`AUDIT_TRIGGER: Inserted record into audit_logs table (Status: Success).`);
    onShowToast('ACID Commit Success', `Atomic transaction of $${amount.toLocaleString()} USD committed successfully.`, 'success');
  };

  const handleRollback = () => {
    setStage('rolledback');
    addLog(`ROLLBACK TRANSACTION; -- Aborting staged changes.`);
    addLog(`WAL_REVERT: Reverting staged mutations. Row locks released.`);
    addLog(`AUDIT_TRIGGER: Inserted record into audit_logs (Status: ABORTED_ROLLBACK).`);
    onShowToast('Transaction Aborted', 'Transaction rolled back safely. Zero database side-effects.', 'warning');
  };

  const handleReset = () => {
    setStage('idle');
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E293B] border border-slate-700 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
              ACID Transaction Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Isolation: SERIALIZABLE</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Atomic Money Transfer Terminal</h1>
          <p className="text-xs text-slate-300">
            Interactive step-by-step ACID-compliant transaction workflow with real-time Commit and Rollback simulation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls */}
        <div className="lg:col-span-6 bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
            <ArrowLeftRight className="w-5 h-5 text-blue-400" />
            Transfer Parameters & Staging
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Source Account
              </label>
              <select
                disabled={stage !== 'idle'}
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                {userAccounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.type} (#{a.accountNumber}) - ${a.balance.toLocaleString()} USD
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Beneficiary Name
              </label>
              <input
                type="text"
                disabled={stage !== 'idle'}
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Beneficiary IBAN
              </label>
              <input
                type="text"
                disabled={stage !== 'idle'}
                value={toIban}
                onChange={(e) => setToIban(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                disabled={stage !== 'idle'}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono disabled:opacity-50"
              />
            </div>
          </div>

          {/* Workflow Step Buttons */}
          <div className="pt-4 border-t border-slate-700 space-y-2">
            {stage === 'idle' && (
              <button
                onClick={handleBeginTxn}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>1. BEGIN TRANSACTION</span>
              </button>
            )}

            {stage === 'begun' && (
              <button
                onClick={handleValidateConstraints}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>2. VALIDATE CONSTRAINTS & LOCK ROW</span>
              </button>
            )}

            {stage === 'validated' && (
              <button
                onClick={handleStageLedger}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>3. STAGE LEDGER MUTATIONS (WAL)</span>
              </button>
            )}

            {stage === 'staged' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCommit}
                  className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMMIT TXN</span>
                </button>
                <button
                  onClick={handleRollback}
                  className="py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ROLLBACK TXN</span>
                </button>
              </div>
            )}

            {(stage === 'committed' || stage === 'rolledback') && (
              <button
                onClick={handleReset}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>START NEW TRANSACTION SESSION</span>
              </button>
            )}
          </div>
        </div>

        {/* Transaction Log Monitor */}
        <div className="lg:col-span-6 bg-[#10172A] p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Database Transaction Console Log
              </h2>
              <span className="text-[10px] font-mono text-slate-400">ACID State: {stage.toUpperCase()}</span>
            </div>

            <div className="bg-black/80 rounded-2xl p-4 font-mono text-[11px] text-emerald-400 h-80 overflow-y-auto space-y-2 border border-slate-800">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic">Click "BEGIN TRANSACTION" to start isolation session...</p>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed border-b border-slate-900/50 pb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> ACID Guarantees Active
            </p>
            <p className="text-[11px] text-slate-400">
              • Atomicity: All mutations execute completely or none at all.
            </p>
            <p className="text-[11px] text-slate-400">
              • Isolation: Concurrent updates locked under SERIALIZABLE policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. ACCOUNT STATEMENT COMPONENT
// ----------------------------------------------------------------------
export const AccountStatementView: React.FC<{
  accounts: BankAccount[];
  transactions: Transaction[];
  currentUser: Customer;
  onShowToast: (title: string, desc: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}> = ({ accounts, transactions, currentUser, onShowToast }) => {
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id || '');
  const [period, setPeriod] = useState<string>('30_days');

  const userAccs = accounts.filter((a) => a.customerName === currentUser.name) || accounts;
  const activeAcc = accounts.find((a) => a.id === selectedAccount) || userAccs[0] || accounts[0];

  const totalDeposits = transactions
    .filter((t) => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter((t) => (t.type === 'Withdrawal' || t.type === 'Transfer') && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExportPDF = () => {
    onShowToast('Statement Exported', `Official PDF statement for Account #${activeAcc?.accountNumber} generated successfully.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E293B] border border-slate-700 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Analytical Report
            </span>
            <span className="text-xs text-slate-400 font-mono">Customer: {currentUser.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Official Account Statement</h1>
          <p className="text-xs text-slate-300">
            Generate and export official bank account statements compiled from immutable ledger entries.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Statement PDF</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Select Account
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              {userAccs.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.type} (#{a.accountNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Statement Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="30_days">Last 30 Days</option>
              <option value="90_days">Last 90 Days</option>
              <option value="ytd">Year to Date (YTD)</option>
            </select>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          IBAN: <span className="text-white font-bold">{activeAcc?.iban}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700">
          <p className="text-xs text-slate-400 font-semibold">Opening Balance</p>
          <p className="text-2xl font-black text-white font-mono mt-1">$200,000.00</p>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700">
          <p className="text-xs text-slate-400 font-semibold">Total Credits (Deposits)</p>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
            +${totalDeposits.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700">
          <p className="text-xs text-slate-400 font-semibold">Total Debits (Transfers/Withdrawals)</p>
          <p className="text-2xl font-black text-rose-400 font-mono mt-1">
            -${totalDebits.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Statement Table */}
      <div className="bg-[#1E293B] rounded-3xl border border-slate-700 p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-4">Statement Line Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 pl-2">Ref Number</th>
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 pr-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 pl-2 font-mono font-bold text-white">{t.referenceNumber}</td>
                  <td className="py-3 font-mono text-slate-300">{t.date} {t.time}</td>
                  <td className="py-3 text-slate-200">{t.description || `${t.type} via ${t.branch}`}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {t.type}
                    </span>
                  </td>
                  <td
                    className={`py-3 pr-2 text-right font-mono font-bold ${
                      t.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {t.type === 'Deposit' ? '+' : '-'}${t.amount.toLocaleString()} USD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 4. LOAN AMORTIZATION MANAGEMENT COMPONENT
// ----------------------------------------------------------------------
export const LoanAmortizationView: React.FC<{
  loans: LoanApplication[];
  currentUser: Customer;
  onShowToast: (title: string, desc: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onApplyLoan?: (loan: Partial<LoanApplication>) => void;
}> = ({ loans, currentUser, onShowToast, onApplyLoan }) => {
  // Calculator inputs
  const [calcPrincipal, setCalcPrincipal] = useState<number>(250000);
  const [calcRate, setCalcRate] = useState<number>(6.5);
  const [calcTermMonths, setCalcTermMonths] = useState<number>(60);

  // Apply Modal state
  const [applyOpen, setApplyOpen] = useState(false);
  const [loanType, setLoanType] = useState<'Personal Loan' | 'Home Mortgage' | 'Business Expansion' | 'Auto Loan'>('Personal Loan');
  const [applyAmount, setApplyAmount] = useState<number>(100000);

  // Calculate Amortization
  const monthlyRate = calcRate / 100 / 12;
  const emi =
    (calcPrincipal * monthlyRate * Math.pow(1 + monthlyRate, calcTermMonths)) /
    (Math.pow(1 + monthlyRate, calcTermMonths) - 1);

  const totalPayable = emi * calcTermMonths;
  const totalInterest = totalPayable - calcPrincipal;

  // Generate Amortization Schedule Table (First 12 months preview)
  const schedule = [];
  let remainingBalance = calcPrincipal;
  for (let month = 1; month <= Math.min(24, calcTermMonths); month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = emi - interestPayment;
    remainingBalance -= principalPayment;
    schedule.push({
      month,
      emi,
      principalPayment,
      interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onApplyLoan) {
      onApplyLoan({
        customerName: currentUser.name,
        customerId: currentUser.id,
        loanType,
        amount: applyAmount,
        interestRate: 6.2,
        termMonths: 48,
        emi: (applyAmount * (6.2 / 1200) * Math.pow(1 + 6.2 / 1200, 48)) / (Math.pow(1 + 6.2 / 1200, 48) - 1),
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        creditScore: currentUser.creditScore || 800,
      });
    }
    onShowToast('Loan Application Submitted', `Your application for $${applyAmount.toLocaleString()} USD has been routed to Branch Manager review.`, 'success');
    setApplyOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E293B] border border-slate-700 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Loan Amortization System
            </span>
            <span className="text-xs text-slate-400 font-mono">Credit Score: {currentUser.creditScore || 820}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Loan Management & Amortization Schedule</h1>
          <p className="text-xs text-slate-300">
            Interactive loan principal/interest schedule breakdown calculator and active credit lines.
          </p>
        </div>

        <button
          onClick={() => setApplyOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply for Credit Line</span>
        </button>
      </div>

      {/* Active Customer Loans */}
      <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-400" />
          Active Customer Loans & Facilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {loan.loanType}
                  </span>
                  <p className="text-xs font-mono text-slate-400 mt-1">ID: {loan.id}</p>
                </div>
                {loan.status === 'Approved' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Approved
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Pending Manager Review
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs border-t border-slate-800 pt-3 font-mono">
                <div>
                  <p className="text-[10px] text-slate-400 font-sans">Principal Amount</p>
                  <p className="font-bold text-white">${loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-sans">Interest APY</p>
                  <p className="font-bold text-indigo-400">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-sans">Monthly EMI</p>
                  <p className="font-bold text-emerald-400">${loan.emi.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Amortization Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
            <Calculator className="w-5 h-5 text-indigo-400" />
            Amortization Calculator Parameters
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Principal Loan Amount</span>
                <span className="font-mono font-bold text-white">${calcPrincipal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={2000000}
                step={10000}
                value={calcPrincipal}
                onChange={(e) => setCalcPrincipal(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Annual Interest Rate (%)</span>
                <span className="font-mono font-bold text-indigo-400">{calcRate}%</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={15.0}
                step={0.1}
                value={calcRate}
                onChange={(e) => setCalcRate(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Tenure (Months)</span>
                <span className="font-mono font-bold text-white">{calcTermMonths} months ({calcTermMonths / 12} yrs)</span>
              </div>
              <input
                type="range"
                min={12}
                max={360}
                step={12}
                value={calcTermMonths}
                onChange={(e) => setCalcTermMonths(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Monthly EMI:</span>
              <span className="font-bold font-mono text-emerald-400">${emi.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Total Interest Payable:</span>
              <span className="font-bold font-mono text-amber-400">${totalInterest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300 border-t border-slate-800 pt-2 font-bold text-white">
              <span>Total Repayment:</span>
              <span className="font-mono text-indigo-400">${totalPayable.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Amortization Schedule Table Preview */}
        <div className="lg:col-span-7 bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center justify-between border-b border-slate-700 pb-3">
            <span>Amortization Schedule (Monthly Split)</span>
            <span className="text-xs text-slate-400 font-mono">First 24 Months</span>
          </h2>

          <div className="overflow-x-auto h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[#1E293B] border-b border-slate-700 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="pb-2">Month</th>
                  <th className="pb-2">Monthly EMI</th>
                  <th className="pb-2">Principal</th>
                  <th className="pb-2">Interest</th>
                  <th className="pb-2 text-right">Remaining Principal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {schedule.map((s) => (
                  <tr key={s.month} className="hover:bg-slate-800/50">
                    <td className="py-2.5 font-bold text-indigo-400">#{s.month}</td>
                    <td className="py-2.5 text-white">${s.emi.toFixed(2)}</td>
                    <td className="py-2.5 text-emerald-400">${s.principalPayment.toFixed(2)}</td>
                    <td className="py-2.5 text-amber-400">${s.interestPayment.toFixed(2)}</td>
                    <td className="py-2.5 text-right text-slate-300">${s.remainingBalance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Loan Apply Modal */}
      {applyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Apply for Credit Facility</h3>
            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Facility Type</label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Home Mortgage">Home Mortgage</option>
                  <option value="Business Expansion">Business Expansion</option>
                  <option value="Auto Loan">Auto Loan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Requested Amount (USD)</label>
                <input
                  type="number"
                  value={applyAmount}
                  onChange={(e) => setApplyAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                Application will be automatically processed through DB Credit Assessment Triggers and assigned to Branch Manager for final underwriting.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
