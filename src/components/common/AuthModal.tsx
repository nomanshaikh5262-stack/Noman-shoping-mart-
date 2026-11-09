import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Smartphone, Mail, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, showToast } = useStore();

  const [identifier, setIdentifier] = useState<string>('nomanshaikh5262@gmail.com');
  const [userName, setUserName] = useState<string>('Noman Shaikh');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('1234');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      showToast(`Verification code sent to ${identifier}! (Use code: 1234)`, 'info');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '1234' && otp.length < 4) {
      showToast('Please enter the 4-digit code (use 1234)', 'error');
      return;
    }

    loginUser(identifier, userName || 'Noman Shaikh');
    onClose();
  };

  const handleOneTapLogin = () => {
    loginUser('nomanshaikh5262@gmail.com', 'Noman Shaikh');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Banner */}
        <div className="bg-[#2874f0] text-white p-6 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-black">SUPER<span className="text-amber-300">MART</span></span>
            <span className="text-[10px] bg-amber-400 text-blue-950 font-black px-2 py-0.5 rounded-full uppercase">
              Plus
            </span>
          </div>

          <h3 className="text-lg font-bold mt-1">Login or Sign Up</h3>
          <p className="text-xs text-blue-100 mt-0.5">
            Get access to your Orders, Wishlist, and SuperCoins rewards.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Noman Shaikh"
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email or Mobile Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter Email or 10-digit mobile number"
                    className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#fb641b] hover:bg-[#e65510] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP...' : 'Request OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="text-gray-500 block">OTP sent to:</span>
                <span className="font-bold text-blue-700 text-xs">{identifier}</span>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Enter 4-digit OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full text-center text-lg tracking-widest font-mono font-black p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <span className="text-[11px] text-gray-400 mt-1 block text-center">
                  Demo code: <strong className="text-emerald-600 font-bold">1234</strong>
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl shadow-md"
              >
                Verify & Log In
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Edit Mobile Number / Email
              </button>
            </form>
          )}

          {/* Quick One-tap Demo Access */}
          <div className="pt-3 border-t border-gray-100 text-center">
            <span className="text-[11px] text-gray-400 font-semibold block mb-2">Or instant access:</span>
            <button
              type="button"
              onClick={handleOneTapLogin}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>One-Tap Continue as Noman Shaikh</span>
            </button>
          </div>

          <div className="text-[10px] text-gray-400 text-center leading-tight">
            By continuing, you agree to SUPER MART's Terms of Use and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};
