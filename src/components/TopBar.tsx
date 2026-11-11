import { BookOpen, LogOut, User } from 'lucide-react';
import { AppView, UserAccount } from '../types';

interface TopBarProps {
  currentView: AppView;
  user: UserAccount | null;
  reservationCount: number;
  onNavigate: (view: AppView) => void;
  onOpenRules: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export function TopBar({
  currentView,
  user,
  reservationCount,
  onNavigate,
  onOpenRules,
  onOpenLogin,
  onLogout,
}: TopBarProps) {
  const isBookingFlow = ['floor-zone', 'date-time', 'seat-map', 'confirm', 'complete'].includes(currentView);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-md px-1 -ml-1"
        >
          <BookOpen className="w-5 h-5 text-slate-900" strokeWidth={2} />
          <span>北科圖書館</span>
        </button>

        {/* Zone 2: Nav Links */}
        <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium">
          <button
            type="button"
            onClick={() => onNavigate('floor-zone')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              isBookingFlow
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            座位預約
          </button>
          <button
            type="button"
            onClick={() => onNavigate('my-reservations')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'my-reservations'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>我的預約</span>
            {reservationCount > 0 && (
              <span className="font-mono-nums text-xs text-slate-500">({reservationCount})</span>
            )}
          </button>
          <button
            type="button"
            onClick={onOpenRules}
            className="hidden sm:inline-block whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            使用規則
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 font-mono-nums whitespace-nowrap">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {user.studentId}
              </span>
              <button
                type="button"
                onClick={onLogout}
                title="登出"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>登出</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              登入
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
