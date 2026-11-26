import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Gamepad2,
  Tv,
  UserCheck,
  AlertTriangle,
  Ban,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const KEY_TERMS = [
  {
    id: '01',
    title: 'No Controller Sharing',
    desc: 'Each booking is strictly for the selected player count. For GTA 6 (1 Player), passing controllers or taking turns between multiple people is prohibited.',
  },
  {
    id: '02',
    title: 'GTA 6 is Strictly 18+ & Family-Friendly Lounge Conduct',
    desc: 'Minors are not permitted to play or spectate GTA 6. Because families and younger gamers use adjacent screens, visiting in-game strip clubs or engaging with nudity/explicit content is strictly prohibited.',
  },
  {
    id: '03',
    title: 'Fixed Screen & On-Time Sessions',
    desc: 'Your booking is fixed to the screen you choose (Screen 1, Screen 2, or Screen 3) and runs for your booked time slot. Online holds expire after 15 minutes if payment is not confirmed.',
  },
  {
    id: '04',
    title: 'Protect Equipment & Keep Lounge Clean',
    desc: 'No feet on walls, sofas, or stations. Handle PS5 consoles, DualSense controllers, 4K TVs, and the racing rig with care. Customers are liable for damage caused by misuse.',
  },
  {
    id: '05',
    title: 'Zero-Tolerance & Non-Refundable Termination',
    desc: 'Breaking the 18+ rule, explicit content ban, or controller-sharing rule will result in immediate session termination without refund.',
  },
];

export default function TermsModal({
  open,
  onOpenChange,
  onAccept,
  requireAcceptance = true,
}) {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (open) {
      setAgreed(false);
    }
  }, [open]);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (requireAcceptance && !agreed) return;
    onOpenChange(false);
    onAccept?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border border-white/15 bg-obsidian text-white rounded-2xl p-6 sm:p-7 max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-neon/30 bg-neon/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon">
              <ShieldCheck size={12} /> The Grid Gaming Lounge
            </span>
            <Link
              to="/policies"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-white/55 hover:text-white mr-6"
            >
              <span>Full Page</span>
              <ExternalLink size={11} />
            </Link>
          </div>
          <DialogTitle className="font-display mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white">
            Terms &amp; Lounge Rules
          </DialogTitle>
          <DialogDescription className="text-xs text-white/60">
            Please review and accept our lounge rules before locking your slot.
          </DialogDescription>
        </DialogHeader>

        {/* Quick 3 Badges */}
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/10 bg-[#0d1017] p-2.5 text-center">
            <Gamepad2 size={15} className="mx-auto text-neon" />
            <p className="mt-1 text-[11px] font-bold text-white">No Sharing</p>
            <p className="text-[10px] text-white/50">1 Player / Controller</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0d1017] p-2.5 text-center">
            <UserCheck size={15} className="mx-auto text-vice" />
            <p className="mt-1 text-[11px] font-bold text-white">Strictly 18+</p>
            <p className="text-[10px] text-white/50">For GTA 6 Sessions</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0d1017] p-2.5 text-center">
            <Tv size={15} className="mx-auto text-cyber" />
            <p className="mt-1 text-[11px] font-bold text-white">Fixed Screen</p>
            <p className="text-[10px] text-white/50">No Switching</p>
          </div>
        </div>

        {/* Scrollable Rules List */}
        <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[38vh]">
          <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0d1017]">
            {KEY_TERMS.map((item) => (
              <div key={item.id} className="p-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-neon">
                    {item.id}
                  </span>
                  <h4 className="font-display font-semibold text-white">
                    {item.title}
                  </h4>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-white/65">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Checkbox & Action Footer */}
        <form onSubmit={handleConfirm} className="mt-4 border-t border-white/10 pt-4 space-y-3.5">
          {requireAcceptance && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/15 bg-[#0d1017] p-3.5 transition-colors hover:border-neon/40">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#00ff66] rounded"
              />
              <span className="text-xs leading-relaxed text-white/85 select-none">
                I have read and agree to <strong className="text-white">The Grid Terms &amp; Lounge Rules</strong>, including the <strong className="text-neon">No Controller Sharing</strong> policy and <strong className="text-vice">18+ GTA 6</strong> rules.
              </span>
            </label>
          )}

          <div className="flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 cursor-pointer rounded-xl border-white/15 bg-transparent px-4 text-xs font-semibold text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>

            {requireAcceptance && (
              <Button
                type="submit"
                disabled={!agreed}
                className="h-10 cursor-pointer rounded-xl bg-neon px-5 text-xs font-extrabold text-obsidian hover:bg-neon/90 disabled:opacity-40"
              >
                <CheckCircle2 size={15} className="mr-1.5" />
                Agree &amp; Confirm Slot
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
