import React, { useState } from 'react';
import { useUIStore } from '@/stores/useUIStore';
import { useContractStore } from '@/stores/useContractStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const QuickRenewModal: React.FC = () => {
  const { isQuickRenewModalOpen, closeQuickRenewModal } = useUIStore();
  const { selectedContract, quickRenewContract } = useContractStore();

  const [durationMonths, setDurationMonths] = useState(12);
  const [rateAdjustment, setRateAdjustment] = useState(5.0);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isQuickRenewModalOpen || !selectedContract) return null;

  const currentVal = selectedContract.totalValue;
  const multiplier = 1 + rateAdjustment / 100;
  const newVal = Math.round(currentVal * multiplier);
  const valDelta = newVal - currentVal;

  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      await quickRenewContract(selectedContract.id, durationMonths, rateAdjustment);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        closeQuickRenewModal();
      }, 1200);
    } catch {
      setIsRenewing(false);
    }
  };

  return (
    <Modal
      isOpen={isQuickRenewModalOpen}
      onClose={closeQuickRenewModal}
      title="Instant Contract Auto-Renewal"
      description={`Accelerate term renewal for ${selectedContract.contractNumber}`}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Contract Renewed Successfully!</h3>
          <p className="text-xs text-slate-500">
            A new active contract was generated with adjusted ${newVal.toLocaleString('en-US')} ARR.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Current vs New comparison */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Current Annual ARR</span>
              <span>New Proposed ARR</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-700">
                ${currentVal.toLocaleString('en-US')}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="text-xl font-extrabold text-emerald-600">
                ${newVal.toLocaleString('en-US')}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">Expansion Delta:</span>
              <span className="font-bold text-emerald-600">
                +${valDelta.toLocaleString('en-US')} ARR ({rateAdjustment}%)
              </span>
            </div>
          </div>

          {/* Term Duration Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Renewal Term Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { months: 6, label: '6 Months' },
                { months: 12, label: '12 Months (1Y)' },
                { months: 24, label: '24 Months (2Y)' },
              ].map((opt) => (
                <button
                  key={opt.months}
                  type="button"
                  onClick={() => setDurationMonths(opt.months)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    durationMonths === opt.months
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-100 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Adjustment Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Annual Rate Escalation</label>
              <span className="font-bold text-blue-600">+{rateAdjustment}%</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 3, 5, 10].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setRateAdjustment(rate)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    rateAdjustment === rate
                      ? 'bg-blue-600 border-blue-600 text-white font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {rate === 0 ? '0% Flat' : `+${rate}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={closeQuickRenewModal}
              disabled={isRenewing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={handleRenew}
              isLoading={isRenewing}
              className="font-bold shadow-xs"
            >
              Execute Renewal
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
