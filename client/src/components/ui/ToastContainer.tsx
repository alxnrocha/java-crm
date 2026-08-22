import React from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-60 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
        };

        const bgMap = {
          success: 'bg-white border-emerald-200 text-slate-900',
          info: 'bg-white border-blue-200 text-slate-900',
          warning: 'bg-white border-amber-200 text-slate-900',
          error: 'bg-white border-red-200 text-slate-900',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200 ${bgMap[toast.type]}`}
          >
            <div className="flex items-start gap-2.5">
              {iconMap[toast.type]}
              <div>
                <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    {toast.message}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
