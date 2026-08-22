import React, { useState } from 'react';
import { useUIStore } from '@/stores/useUIStore';
import { useContractStore } from '@/stores/useContractStore';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { toast } from '@/stores/useToastStore';

export const AddAmendmentModal: React.FC = () => {
  const { isAmendmentModalOpen, closeAmendmentModal } = useUIStore();
  const { selectedContract, addAmendment } = useContractStore();

  const [amendmentTitle, setAmendmentTitle] = useState('');
  const [valueDelta, setValueDelta] = useState('25000');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [authorName, setAuthorName] = useState('Sarah Chen');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAmendmentModalOpen || !selectedContract) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amendmentTitle.trim()) {
      setError('Please provide an amendment title');
      return;
    }

    const delta = parseFloat(valueDelta) || 0;
    setIsSubmitting(true);
    setError('');

    try {
      await addAmendment(selectedContract.id, {
        amendmentTitle,
        valueDelta: delta,
        effectiveDate,
        authorName,
        description,
      });

      toast.success('Amendment Recorded', `Applied +$${delta.toLocaleString('en-US')} ARR to ${selectedContract.contractNumber}.`);
      closeAmendmentModal();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isAmendmentModalOpen}
      onClose={closeAmendmentModal}
      title="Add Contract Amendment"
      description={`Record terms modification for ${selectedContract.contractNumber}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        <Input
          label="Amendment Title"
          placeholder="e.g. Amendment #3 — Enterprise AI Addon"
          value={amendmentTitle}
          onChange={(e) => setAmendmentTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="ARR Value Delta ($)"
            type="number"
            placeholder="+25000"
            value={valueDelta}
            onChange={(e) => setValueDelta(e.target.value)}
            required
          />

          <Input
            label="Effective Date"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            required
          />
        </div>

        <Input
          label="Author / Legal Signatory"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-slate-700">
            Amendment Description & Scope
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details regarding scope modifications, rate tier adjustments, or addon services..."
            className="w-full rounded-lg bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={closeAmendmentModal}
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
            Save Amendment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
