import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  MinusCircle,
  Send,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { BankAccount } from '../../types/bank';

interface ActionModalProps {
  type: 'deposit' | 'withdraw' | 'transfer';
  accounts: BankAccount[];
  initialAccount?: BankAccount;
  onClose: () => void;
  onSubmit: (data: {
    type: 'deposit' | 'withdraw' | 'transfer';
    accountId: string;
    amount: number;
    receiverName?: string;
    receiverIban?: string;
  }) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  type,
  accounts,
  initialAccount,
  onClose,
  onSubmit,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    initialAccount ? initialAccount.id : accounts[0]?.id || ''
  );
  const [amount, setAmount] = useState<string>('1500');
  const [receiverName, setReceiverName] = useState<string>('JP Morgan Chase Corporate');
  const [receiverIban, setReceiverIban] = useState<string>('US33JPMC0000112940192');
  const [error, setError] = useState<string>('');

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    if ((type === 'withdraw' || type === 'transfer') && selectedAccount) {
      if (numAmount > selectedAccount.balance) {
        setError(
          `Insufficient account balance. Available: $${selectedAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        );
        return;
      }
    }

    if (type === 'transfer') {
      if (!receiverName.trim() || !receiverIban.trim()) {
        setError('Receiver name and IBAN are required for wire transfers.');
        return;
      }
    }

    onSubmit({
      type,
      accountId: selectedAccountId,
      amount: numAmount,
      receiverName: type === 'transfer' ? receiverName : undefined,
      receiverIban: type === 'transfer' ? receiverIban : undefined,
    });
  };

  const titles = {
    deposit: 'Quick Account Deposit',
    withdraw: 'Account Funds Withdrawal',
    transfer: 'Transfer / Wire Payment',
  };

  const icons = {
    deposit: <PlusCircle className="w-5 h-5 text-emerald-400" />,
    withdraw: <MinusCircle className="w-5 h-5 text-rose-400" />,
    transfer: <Send className="w-5 h-5 text-blue-400" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#151515] border border-slate-800 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative font-sans glow-primary">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            {icons[type]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{titles[type]}</h3>
            <p className="text-xs text-slate-400">
              {type === 'deposit' && 'Add funds to your account balance'}
              {type === 'withdraw' && 'Withdraw cash or transfer to external payout'}
              {type === 'transfer' && 'Transfer funds to another account or IBAN'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Select Source/Target Account */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Bank Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-blue-500"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.type} ({acc.accountNumber}) — Balance: ${acc.balance.toLocaleString()} {acc.currency}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Amount ({selectedAccount?.currency || 'USD'})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 pl-8 pr-4 text-white text-sm font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Transfer fields */}
          {type === 'transfer' && (
            <>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="e.g. John Doe or Enterprise Entity"
                  className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Recipient IBAN / Account Number</label>
                <input
                  type="text"
                  required
                  value={receiverIban}
                  onChange={(e) => setReceiverIban(e.target.value)}
                  placeholder="e.g. DE89370400440532013000"
                  className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-1/2 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all ${
                type === 'deposit'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                  : type === 'withdraw'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 glow-primary'
              }`}
            >
              Confirm {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
