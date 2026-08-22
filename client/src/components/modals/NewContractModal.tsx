import React, { useState } from 'react';
import { useUIStore } from '@/stores/useUIStore';
import { useContractStore } from '@/stores/useContractStore';
import { BillingTerm } from '@/types/crm';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { INITIAL_ACCOUNTS } from '@/services/mockData';

import { toast } from '@/stores/useToastStore';

export const NewContractModal: React.FC = () => {
  const { isNewContractModalOpen, closeNewContractModal, openDrawer } = useUIStore();
  const { createContract } = useContractStore();

  const [accountId, setAccountId] = useState(INITIAL_ACCOUNTS[0].id);
  const [title, setTitle] = useState('');
  const [totalValue, setTotalValue] = useState('180000');
  const [billingTerm, setBillingTerm] = useState<BillingTerm>('ANNUAL');
  const [startDate, setStartDate] = useState('2026-04-01');
  const [endDate, setEndDate] = useState('2027-04-01');
  const [autoRenew, setAutoRenew] = useState(true);
  const [ownerName, setOwnerName] = useState('Sarah Chen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isNewContractModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a contract title');
      return;
    }
    const val = parseFloat(totalValue);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid positive contract value');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const created = await createContract({
        accountId,
        title,
        totalValue: val,
        billingTerm,
        startDate,
        endDate,
        autoRenew,
        ownerName,
      });

      toast.success('Contract Created', `Contract ${created?.contractNumber || ''} registered in Draft state.`);
      closeNewContractModal();
      openDrawer();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isNewContractModalOpen}
      onClose={closeNewContractModal}
      title="Create B2B Enterprise Contract"
      description="Initialize a new master agreement in Draft state"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        <Select
          label="Enterprise Account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          {INITIAL_ACCOUNTS.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.corporateName} ({acc.domain}) — {acc.tier}
            </option>
          ))}
        </Select>

        <Input
          label="Contract Title"
          placeholder="e.g. Master Services Agreement 2026"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Total Value (USD / ARR)"
            type="number"
            value={totalValue}
            onChange={(e) => setTotalValue(e.target.value)}
            required
          />

          <Select
            label="Billing Term"
            value={billingTerm}
            onChange={(e) => setBillingTerm(e.target.value as BillingTerm)}
          >
            <option value="ANNUAL">Annual (12 Months)</option>
            <option value="QUARTERLY">Quarterly (3 Months)</option>
            <option value="MONTHLY">Monthly</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <Input
          label="Account Owner"
          placeholder="Sarah Chen"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
        />

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-xs font-bold text-slate-800">Auto-Renewal Clause</span>
            <p className="text-[11px] text-slate-500">Automatically renew upon term expiration</p>
          </div>
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={closeNewContractModal}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            className="font-bold shadow-xs"
          >
            Create Contract
          </Button>
        </div>
      </form>
    </Modal>
  );
};
