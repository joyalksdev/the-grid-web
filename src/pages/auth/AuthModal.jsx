import React, { useState } from 'react';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AuthModal({ open, onOpenChange, onSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setStep('otp');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    onSuccess?.({
      name: 'Grid Player',
      phone: `+91 ${phone}`,
    });
    setStep('phone');
    setOtp('');
    onOpenChange(false);
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
              ? 'Enter your WhatsApp number so we can send your booking confirmation pass.'
              : `We sent a 4-digit verification code to +91 ${phone}.`}
          </DialogDescription>
        </DialogHeader>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="mt-4 space-y-4">
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
              className="h-11 w-full cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
            >
              Send OTP <ArrowRight size={15} className="ml-1.5" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-white/70">
                4-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-center font-mono text-xl font-semibold tracking-[0.5em] text-neon outline-none focus:border-white/40"
              />
            </div>

            <div className="flex gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('phone')}
                className="h-11 w-1/3 cursor-pointer rounded-xl border-white/15 bg-transparent text-xs text-white hover:bg-white/[0.06]"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="h-11 w-2/3 cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
              >
                <CheckCircle2 size={15} className="mr-1.5" />
                Verify &amp; Continue
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
