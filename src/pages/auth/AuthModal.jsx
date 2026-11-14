import React, { useState } from 'react';
import { Phone, User, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CodeSlots from '@/components/CodeSlots';
import { useSwipeToast } from '@/components/SwipeToast';
import { authService } from '@/services/authService';

export default function AuthModal({ open, onOpenChange, onSuccess }) {
  const toast = useSwipeToast();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCodeHint, setDevCodeHint] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return;

    setError('');
    setDevCodeHint('');
    setLoading(true);
    try {
      const data = await authService.sendOtp({
        phone,
        name: name.trim() || 'Grid Player',
      });
      if (data?.devOtp) {
        setDevCodeHint(data.devOtp);
      }
      setStep('otp');
      toast.info(
        'Verification Code Sent',
        `Enter the 6-digit code sent to +91 ${phone}.`
      );
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
        toast.error('Could Not Send Code', err.response.data.error);
      } else if (import.meta.env.DEV && !err.response) {
        setStep('otp');
      } else {
        setError('Could not send verification code. Please try again.');
        toast.error(
          'Connection Error',
          'Could not send verification code. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (otp.length < 6) return;

    setError('');
    setLoading(true);
    try {
      const data = await authService.verifyOtp({
        phone,
        otp,
        name: name.trim() || 'Grid Player',
      });

      if (data?.token) {
        localStorage.setItem('grid_token', data.token);
      }

      const verifiedUser = data?.user || {
        name: name.trim() || 'Grid Player',
        phone: `+91 ${phone}`,
      };

      onSuccess?.(verifiedUser);
      toast.success(
        `Welcome, ${verifiedUser.name}!`,
        'Your WhatsApp number is verified and ready to book.'
      );

      setStep('phone');
      setOtp('');
      setDevCodeHint('');
      onOpenChange(false);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
        toast.error('Verification Failed', err.response.data.error);
      } else if (import.meta.env.DEV && !err.response) {
        const fallbackUser = {
          name: name.trim() || 'Grid Player',
          phone: `+91 ${phone}`,
        };
        onSuccess?.(fallbackUser);
        toast.success(`Signed in as ${fallbackUser.name}`);
        setStep('phone');
        setOtp('');
        onOpenChange(false);
      } else {
        setError('Could not verify code. Please try again.');
        toast.error('Verification Error', 'Could not verify code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border border-white/15 bg-obsidian text-white rounded-2xl p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight text-white">
            {step === 'phone' ? 'Sign In to Book' : 'Enter Verification Code'}
          </DialogTitle>
          <DialogDescription className="text-xs text-white/60">
            {step === 'phone'
              ? 'Enter your name and WhatsApp number so we can send your booking confirmation pass.'
              : `We sent a 6-digit verification code to +91 ${phone}.`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mt-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-white/70">
                Your Name
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 focus-within:border-white/40">
                <User size={15} className="mr-2.5 text-neon" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/25"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-white/70">
                WhatsApp Mobile Number
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 focus-within:border-white/40">
                <Phone size={15} className="mr-2.5 text-neon" />
                <span className="mr-2 text-xs font-medium text-white/50">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/25"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || phone.length < 10}
              className="h-11 w-full cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="mr-1.5 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  Send Verification Code <ArrowRight size={15} className="ml-1.5" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            {devCodeHint && (
              <button
                type="button"
                onClick={() => setOtp(String(devCodeHint))}
                className="w-full cursor-pointer rounded-xl border border-neon/30 bg-neon/10 px-3 py-2 text-center text-xs text-neon transition-colors hover:bg-neon/15"
              >
                Test Code: <strong>{devCodeHint}</strong>{' '}
                <span className="text-[10px] text-white/60">(Click to fill)</span>
              </button>
            )}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-white/70">
                  6-Digit Verification Code
                </label>
                <span className="text-[11px] font-mono text-white/45">
                  {otp.length}/6 digits
                </span>
              </div>

              {/* React Bits CodeSlots Component */}
              <CodeSlots
                length={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
              />
            </div>

            <div className="flex gap-2.5 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setError('');
                  setOtp('');
                  setStep('phone');
                }}
                className="h-11 w-1/3 cursor-pointer rounded-xl border-white/15 bg-transparent text-xs text-white hover:bg-white/[0.06]"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className="h-11 w-2/3 cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="mr-1.5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} className="mr-1.5" />
                    Verify &amp; Continue
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
