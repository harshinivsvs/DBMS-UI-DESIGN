import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  Send,
  Download,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Building,
} from 'lucide-react';
import { Transaction, TransactionStatus } from '../../types/bank';

interface TransactionsViewProps {
  transactions: Transaction[];
  onOpenTransferModal: () => void;
  onShowToast: (title: string, desc: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onOpenTransferModal,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TransactionStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-white/10">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-[#3B82F6]" /> SWIFT & Interbank Transaction Ledger
          </h2>
          <p className="text-xs text-[#CBD5E1]/60 mt-0.5">
            Real-time multi-currency wire transfers, SWIFT MT103 receipts, and SEPA instant audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Initiate New Transfer</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#CBD5E1]/40 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Reference, Sender, Receiver, SWIFT..."
            className="w-full bg-[#101827] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-[#CBD5E1]/40 focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-[#CBD5E1]/50 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {(['All', 'Completed', 'Pending', 'Failed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === st
                  ? 'bg-[#2563EB] text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                  : 'bg-white/5 text-[#CBD5E1]/70 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#101827] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2563EB]"
        >
          <option value="All">All Categories</option>
          <option value="Corporate">Corporate</option>
          <option value="Retail">Retail</option>
          <option value="Interbank">Interbank</option>
          <option value="Treasury">Treasury</option>
        </select>
      </div>

      {/* Transaction Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#050816]/60 text-[#CBD5E1]/60 font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Reference ID</th>
                <th className="p-4">Sender & Receiver</th>
                <th className="p-4">Type & Category</th>
                <th className="p-4">Amount (USD)</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#CBD5E1]/40">
                    No transactions match current filters.
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors group">
                    {/* Reference ID */}
                    <td className="p-4 pl-6">
                      <p className="font-mono-num font-bold text-white group-hover:text-[#3B82F6] transition-colors">
                        {tx.referenceNumber}
                      </p>
                      <span className="text-[10px] text-[#CBD5E1]/50">{tx.id}</span>
                    </td>

                    {/* Sender & Receiver */}
                    <td className="p-4">
                      <p className="text-white font-semibold">{tx.senderName}</p>
                      <p className="text-[11px] text-[#CBD5E1]/50 truncate max-w-[200px]">→ {tx.receiverName}</p>
                    </td>

                    {/* Type */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2563EB]/15 text-[#3B82F6] border border-[#2563EB]/30">
                        {tx.type}
                      </span>
                      <p className="text-[10px] text-[#CBD5E1]/50 mt-1">{tx.category}</p>
                    </td>

                    {/* Amount */}
                    <td className="p-4">
                      <p className="font-mono-num text-sm font-extrabold text-white">
                        ${tx.amount.toLocaleString()} <span className="text-[10px] text-[#CBD5E1]/50">{tx.currency}</span>
                      </p>
                      <span className="text-[10px] text-[#CBD5E1]/40">Fee: ${tx.fee}</span>
                    </td>

                    {/* Date Time */}
                    <td className="p-4">
                      <p className="font-mono-num text-white">{tx.date}</p>
                      <p className="text-[10px] text-[#CBD5E1]/50 font-mono-num">{tx.time}</p>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {tx.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {tx.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> Pending SWIFT
                        </span>
                      )}
                      {tx.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-red-500/15 text-red-400 border border-red-500/30">
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedTxn(tx)}
                        className="p-2 bg-white/5 hover:bg-[#2563EB]/20 text-[#CBD5E1] hover:text-[#3B82F6] rounded-xl transition-all"
                        title="View MT103 Voucher"
                      >
                        <FileCheck className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-[#CBD5E1]/60 bg-[#050816]/40">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} transactions
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono-num font-bold text-white px-2">
              Page {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SWIFT MT103 VOUCHER MODAL */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0B1E36] border border-white/15 rounded-3xl w-full max-w-xl p-6 lg:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#22C55E]" /> Official SWIFT MT103 Confirmation Receipt
                </h3>
                <p className="text-xs text-[#CBD5E1]/50 font-mono-num">
                  REF: {selectedTxn.referenceNumber} • Gateway BIC: {selectedTxn.swiftBic || 'ELITDEFFXXX'}
                </p>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1.5 text-[#CBD5E1]/60 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#101827] p-5 rounded-2xl border border-white/10 space-y-3 text-xs font-mono-num">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#CBD5E1]/50 font-sans">Sender Entity:</span>
                <span className="text-white font-bold">{selectedTxn.senderName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#CBD5E1]/50 font-sans">Sender IBAN:</span>
                <span className="text-[#3B82F6]">{selectedTxn.senderIban}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#CBD5E1]/50 font-sans">Receiver Entity:</span>
                <span className="text-white font-bold">{selectedTxn.receiverName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#CBD5E1]/50 font-sans">Receiver IBAN:</span>
                <span className="text-[#3B82F6]">{selectedTxn.receiverIban}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#CBD5E1]/50 font-sans">Transferred Value:</span>
                <span className="text-[#22C55E] text-sm font-extrabold">
                  ${selectedTxn.amount.toLocaleString()} {selectedTxn.currency}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#CBD5E1]/50 font-sans">Settlement Date:</span>
                <span className="text-white">
                  {selectedTxn.date} @ {selectedTxn.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]/50 font-sans">Digital Signature Hash:</span>
                <span className="text-[10px] text-amber-400 truncate max-w-[200px]">
                  0x8f22a019e04910f2c88d1204a91901b02
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-[10px] text-[#22C55E] font-bold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SWIFT Clearing Validated
              </span>
              <button
                onClick={() => {
                  onShowToast('Receipt Downloaded', 'Exported encrypted MT103 voucher.', 'success');
                  setSelectedTxn(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
