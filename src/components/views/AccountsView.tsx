import React from 'react';
import {
  Landmark,
  PlusCircle,
  MinusCircle,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { BankAccount } from '../../types/bank';

interface AccountsViewProps {
  accounts: BankAccount[];
  onOpenActionModal: (action: 'deposit' | 'withdraw' | 'transfer', targetAccount?: BankAccount) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  onOpenActionModal,
}) => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#1E293B] border border-slate-700/80 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-[#3B82F6]" /> Bank Account Records
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Displaying all active bank account records, balances, interest rates, and quick transaction controls.
          </p>
        </div>

        <button
          onClick={() => onOpenActionModal('deposit')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Quick Deposit</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-[#3B82F6]/50 transition-all"
          >
            <div>
              {/* Header: Type & Status */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30">
                  {acc.type}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 uppercase border ${
                    acc.status === 'Active'
                      ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" /> {acc.status}
                </span>
              </div>

              {/* Customer Name */}
              <h3 className="text-lg font-bold text-white mb-1">{acc.customerName}</h3>
              <p className="text-xs text-slate-400 font-mono mb-4">ID: {acc.id}</p>

              {/* Account Number & IBAN */}
              <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800 space-y-2 mb-5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Account Number
                  </span>
                  <span className="text-sm font-mono font-extrabold text-white tracking-widest">
                    {acc.accountNumber}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    IBAN Code
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#3B82F6]">
                    {acc.iban}
                  </span>
                </div>
              </div>

              {/* Balance & Interest */}
              <div className="mb-6">
                <span className="text-xs text-slate-400 font-semibold uppercase">Current Balance</span>
                <p className="text-2xl font-black text-[#10B981] font-mono-num mt-0.5">
                  ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                  <span className="text-xs text-slate-400 font-normal">{acc.currency}</span>
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <TrendingUp className="w-3 h-3 text-[#10B981]" /> Interest Rate: {acc.interestRate}% APY
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-700/60">
              <button
                onClick={() => onOpenActionModal('deposit', acc)}
                className="py-2 px-1 bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#10B981]/30 flex flex-col sm:flex-row items-center justify-center gap-1"
                title="Deposit Funds"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Deposit</span>
              </button>

              <button
                onClick={() => onOpenActionModal('withdraw', acc)}
                className="py-2 px-1 bg-[#F43F5E]/15 hover:bg-[#F43F5E] text-[#F43F5E] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#F43F5E]/30 flex flex-col sm:flex-row items-center justify-center gap-1"
                title="Withdraw Funds"
              >
                <MinusCircle className="w-3.5 h-3.5" />
                <span>Withdraw</span>
              </button>

              <button
                onClick={() => onOpenActionModal('transfer', acc)}
                className="py-2 px-1 bg-[#3B82F6]/15 hover:bg-[#3B82F6] text-[#3B82F6] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#3B82F6]/30 flex flex-col sm:flex-row items-center justify-center gap-1"
                title="Transfer Funds"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transfer</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
