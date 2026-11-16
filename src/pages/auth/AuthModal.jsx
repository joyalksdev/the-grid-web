import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({ open, onOpenChange, onSuccess }) {
  const toast = useSwipeToast();

  // Steps: 'email' (Step 1) | 'register' (Step 2B - New User) | 'otp' (Step 2A / Final Verify)
  const [step, setStep] = useState('email');
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset modal cleanly when closed
  useEffect(() => {
    if (!open) {
      setError('');
      setOtp('');
    }
  }, [open]);

  // Step 1: Identity Check by Email ID
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await authService.checkEmail(cleanEmail);
      setEmail(cleanEmail);

      if (data?.exists) {
        // Step 2A: Existing User -> OTP already sent via Nodemailer
        setIsNewUser(false);
        setStep('otp');
        toast.info?.(
          'Verification Code Sent',
          `Enter the 6-digit code sent to ${cleanEmail}.`
        );
      } else {
        // Step 2B: New User -> Smoothly transition to Registration with pre-filled email
        setIsNewUser(true);
        setStep('register');
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        'Could not check email address. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2B: New User Registration -> Send Nodemailer OTP
  const handleSendRegistrationOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.sendEmailOtp({
        email: cleanEmail,
        phone: cleanPhone,
      });

      setStep('otp');
      toast.info?.(
        'Verification Code Sent',
        `Enter the 6-digit code sent to ${cleanEmail}.`
      );
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        'Could not send verification email. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Verify Nodemailer OTP (Login or Create Account)
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (otp.length < 6) return;

    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);

      const data = await authService.verifyEmailOtp({
        email: cleanEmail,
        otp,
        phone: cleanPhone || undefined,
      });

      if (data?.token) {
        localStorage.setItem('grid_token', data.token);
      }

      const verifiedUser = data?.user || {
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: cleanPhone ? `+91 ${cleanPhone}` : '',
      };

      // Reset internal step state before closing
      setStep('email');
      setOtp('');
      onOpenChange(false);

      // Trigger parent callback (which also auto-resumes GTA 6 booking if pending)
      onSuccess?.(verifiedUser);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        'Invalid or expired verification code. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border border-white/15 bg-obsidian text-white rounded-2xl p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight text-white">
            {step === 'email'
              ? 'Continue with Email'
              : step === 'register'
              ? 'Complete Registration'
              : 'Verify Your Email'}
          </DialogTitle>
          <DialogDescription className="text-xs text-white/60">
            {step === 'email'
              ? 'Enter your email address to sign in or create your Grid account.'
              : step === 'register'
              ? 'Looks like you are new here! Add your WhatsApp number to receive your GTA 6 pass.'
              : `We sent a 6-digit verification code to ${email}.`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mt-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* STEP 1: IDENTITY CHECK (EMAIL ONLY) */}
        {step === 'email' && (
          <form onSubmit={handleCheckEmail} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-white/70">
                Email Address
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 focus-within:border-neon">
                <Mail size={15} className="mr-2.5 text-neon shrink-0" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/25"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="h-11 w-full cursor-pointer rounded-xl bg-neon text-xs font-bold text-obsidian hover:bg-neon/90"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="mr-1.5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Continue <ArrowRight size={15} className="ml-1.5" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* STEP 2B: NEW USER SEAMLESS REGISTRATION */}
        {step === 'register' && (
          <form onSubmit={handleSendRegistrationOtp} className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white/70">
                  Email Address
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('email');
                  }}
                  className="text-[11px] font-medium text-neon hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
              <div className="mt-1.5 flex items-center rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 focus-within:border-neon">
                <Mail size={15} className="mr-2.5 text-neon shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/25"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-white/70">
                WhatsApp Number <span className="text-neon">*</span>
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 focus-within:border-neon">
                <Phone size={15} className="mr-2.5 text-neon shrink-0" />
                <span className="mr-2 text-xs font-mono font-medium text-white/50">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  autoFocus
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="98765 43210"
                  className="w-full bg-transparent font-mono text-sm font-semibold text-white outline-none placeholder:text-white/25"
                />
              </div>
              <p className="mt-1 text-[11px] text-white/45">
                Used to verify your booking and deliver your digital pass on WhatsApp.
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setError('');
                  setStep('email');
                }}
                className="h-11 w-1/3 cursor-pointer rounded-xl border-white/15 bg-transparent text-xs text-white hover:bg-white/[0.06]"
              >
                <ArrowLeft size={14} className="mr-1" /> Back
              </Button>
              <Button
                type="submit"
                disabled={loading || phone.replace(/\D/g, '').length !== 10}
                className="h-11 w-2/3 cursor-pointer rounded-xl bg-neon text-xs font-bold text-obsidian hover:bg-neon/90"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="mr-1.5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send Email OTP <ArrowRight size={15} className="ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2A / FINAL: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-white/70">
                  6-Digit Email Verification Code
                </label>
                <span className="text-[11px] font-mono text-white/45">
                  {otp.length}/6 digits
                </span>
              </div>

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
                  setStep(isNewUser ? 'register' : 'email');
                }}
                className="h-11 w-1/3 cursor-pointer rounded-xl border-white/15 bg-transparent text-xs text-white hover:bg-white/[0.06]"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className="h-11 w-2/3 cursor-pointer rounded-xl bg-neon text-xs font-bold text-obsidian hover:bg-neon/90"
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
