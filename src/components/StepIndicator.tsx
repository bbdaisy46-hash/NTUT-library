import { Check } from 'lucide-react';
import { AppView } from '../types';

interface StepIndicatorProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const STEPS: { view: AppView; num: string; label: string }[] = [
  { view: 'floor-zone', num: '02', label: '樓層與區域' },
  { view: 'date-time', num: '03', label: '日期與時段' },
  { view: 'seat-map', num: '04', label: '選擇座位' },
  { view: 'confirm', num: '05', label: '確認預約' },
  { view: 'complete', num: '06', label: '預約完成' },
];

export function StepIndicator({ currentView, onNavigate }: StepIndicatorProps) {
  const currentIdx = STEPS.findIndex((s) => s.view === currentView);
  if (currentIdx === -1) return null;

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <ol className="flex items-center justify-between sm:justify-start sm:gap-8 overflow-x-auto">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const canClick = isCompleted && currentView !== 'complete';

            return (
              <li key={step.view} className="flex items-center shrink-0">
                <button
                  type="button"
                  disabled={!canClick}
                  onClick={() => canClick && onNavigate(step.view)}
                  className={`flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    canClick ? 'cursor-pointer hover:text-slate-900' : 'cursor-default'
                  } ${
                    isCurrent
                      ? 'text-slate-900 font-semibold'
                      : isCompleted
                        ? 'text-slate-600'
                        : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-mono-nums text-xs font-semibold ${
                      isCurrent
                        ? 'bg-slate-900 text-white'
                        : isCompleted
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <span className="hidden sm:inline-block ml-8 text-slate-300 select-none" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
