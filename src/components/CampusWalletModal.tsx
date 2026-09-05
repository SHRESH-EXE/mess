import React, { useState } from 'react';
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, X, CheckCircle2, QrCode, ShieldCheck, Sparkles, CreditCard, RefreshCw } from 'lucide-react';
import { CampusWalletTransaction } from '../types/mess';
import { generateUpiQrCodeUrl, generateUpiIntentUri, DEFAULT_CAMPUS_UPI_VPA, DEFAULT_PAYEE_NAME } from '../utils/payment';
import confetti from 'canvas-confetti';

interface CampusWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  transactions: CampusWalletTransaction[];
  onTopUp: (amount: number, description: string) => void;
  studentName?: string;
  studentRollNo?: string;
}

export const CampusWalletModal: React.FC<CampusWalletModalProps> = ({
  isOpen,
  onClose,
  walletBalance,
  transactions,
  onTopUp,
  studentName = 'Student',
  studentRollNo = '12345678'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'topup' | 'history'>('overview');
  const [selectedAmount, setSelectedAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [topUpSuccess, setTopUpSuccess] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);

  if (!isOpen) return null;

  const finalAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const upiDetails = {
    vpa: DEFAULT_CAMPUS_UPI_VPA,
    payeeName: DEFAULT_PAYEE_NAME,
    amount: finalAmount,
    transactionNote: `LPU Campus Wallet Top-up: ${studentRollNo}`,
    orderId: `WALLET-${Date.now().toString().slice(-6)}`
  };

  const upiQrUrl = generateUpiQrCodeUrl(upiDetails, 240);
  const upiIntentUri = generateUpiIntentUri(upiDetails);

  const handleSimulatePayment = () => {
    if (finalAmount <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      onTopUp(finalAmount, `UPI Recharge (Ref: TXN${Date.now().toString().slice(-6)})`);
      setIsProcessing(false);
      setTopUpSuccess(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        setTopUpSuccess(false);
        setActiveTab('overview');
        setCustomAmount('');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Digital Campus Wallet
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  LPU Pay
                </span>
              </h2>
              <p className="text-xs text-slate-400">Linked to Reg No: <span className="text-slate-200 font-mono font-medium">{studentRollNo}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1 gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Balance & Card
          </button>
          <button
            onClick={() => setActiveTab('topup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'topup'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Recharge (UPI)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Passbook ({transactions.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Virtual Campus Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 p-5 text-slate-950 shadow-xl shadow-amber-500/10">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950/20 px-2 py-0.5 rounded text-white">
                      Lovely Professional University
                    </span>
                    <p className="text-xs font-medium text-slate-900 mt-1">Smart Dining & Food Wallet</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-200" />
                </div>

                <div className="my-5">
                  <span className="text-xs font-bold text-slate-900 uppercase">Available Balance</span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-mono">
                    ₹{walletBalance.toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-slate-950/20">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-900">Cardholder</p>
                    <p className="text-xs font-black text-slate-950 tracking-wide">{studentName}</p>
                  </div>
                  <div className="text-right font-mono text-xs font-bold text-slate-900">
                    •••• {studentRollNo.slice(-4)}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('topup')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  Instant UPI Recharge
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  View All Spends
                </button>
              </div>

              {/* Benefits Banner */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Why use Campus Wallet?</span>
                </div>
                <ul className="text-slate-300 space-y-1 text-[11px] list-disc list-inside">
                  <li><strong>Zero UPI Failures</strong>: 1-tap instant counter checkout without network lag.</li>
                  <li><strong>Automatic Mess Rebate Credits</strong>: Refund days credited straight to your balance.</li>
                  <li><strong>Valid across all UniMall stalls</strong>, Law Gate & Maheru partner eateries.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'topup' && (
            <div className="space-y-4">
              {topUpSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-100">Recharge Successful!</h3>
                  <p className="text-xs text-slate-400">₹{finalAmount} has been credited to your Campus Wallet.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-2 block">
                      Select Recharge Amount
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 200, 500, 1000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setCustomAmount('');
                          }}
                          className={`py-2.5 rounded-xl font-bold text-xs transition border ${
                            selectedAmount === amt && !customAmount
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                      Or Enter Custom Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 350"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Payment Mode Selector */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Total Recharge Amount:</span>
                      <span className="text-lg font-black text-amber-400 font-mono">₹{finalAmount}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowQr(!showQr)}
                        className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition"
                      >
                        <QrCode className="w-4 h-4 text-amber-400" />
                        {showQr ? 'Hide QR Code' : 'Scan UPI QR'}
                      </button>

                      <a
                        href={upiIntentUri}
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition"
                      >
                        <CreditCard className="w-4 h-4" />
                        Open UPI App
                      </a>
                    </div>

                    {showQr && (
                      <div className="p-3 bg-white rounded-xl text-center space-y-2 w-fit mx-auto shadow-xl">
                        <img
                          src={upiQrUrl}
                          alt="Recharge UPI QR"
                          className="w-40 h-40 mx-auto"
                        />
                        <p className="text-[10px] font-bold text-slate-900">Scan with GPay / PhonePe / Paytm</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing || finalAmount <= 0}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying with Bank...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Confirm & Add ₹{finalAmount} to Wallet</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2.5">
              {transactions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <p>No wallet transactions yet.</p>
                  <p className="text-slate-500 mt-1">Recharge or place orders to view activity.</p>
                </div>
              ) : (
                transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          txn.type === 'topup' || txn.type === 'mess_rebate_refund'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {txn.type === 'topup' || txn.type === 'mess_rebate_refund' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{txn.description}</p>
                        <p className="text-[10px] text-slate-400">{txn.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-black font-mono text-sm ${
                          txn.type === 'topup' || txn.type === 'mess_rebate_refund'
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {txn.type === 'topup' || txn.type === 'mess_rebate_refund' ? '+' : '-'}₹{txn.amount}
                      </p>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-semibold">
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Encrypted 256-bit Secure Campus Payment Gateway</span>
        </div>
      </div>
    </div>
  );
};
