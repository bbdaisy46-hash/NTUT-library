import { useState } from 'react';
import { Calendar, Clock, Lock, MapPin, Armchair, User, CheckCircle2 } from 'lucide-react';
import { formatDateWithWeekday, formatHour } from '../data/libraryData';
import { AppView, FloorId, UserAccount, ZoneId } from '../types';

interface ConfirmStepProps {
  floor: FloorId;
  zone: ZoneId;
  date: string;
  startHour: number;
  endHour: number;
  seatId: string;
  user: UserAccount | null;
  onLogin: (account: UserAccount) => void;
  onLogout: () => void;
  onJumpToStep: (view: AppView) => void;
  onOpenRules: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function ConfirmStep({
  floor,
  zone,
  date,
  startHour,
  endHour,
  seatId,
  user,
  onLogin,
  onLogout,
  onJumpToStep,
  onOpenRules,
  onBack,
  onConfirm,
}: ConfirmStepProps) {
  const [studentIdInput, setStudentIdInput] = useState('112360001');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  const [agreedRules, setAgreedRules] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInlineLogin = () => {
    const trimmed = studentIdInput.trim();
    if (!trimmed || !passwordInput.trim()) {
      setErrorMsg('請輸入完整的校園帳號與密碼');
      return false;
    }
    onLogin({
      studentId: trimmed,
      name: trimmed === '112360001' ? '林北科' : '同學',
      department: '資訊工程系',
    });
    setErrorMsg('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      const ok = handleInlineLogin();
      if (!ok) return;
    }
    if (!agreedRules) {
      setErrorMsg('請先勾選「我已閱讀使用規則」後再送出預約');
      return;
    }
    setErrorMsg('');
    onConfirm();
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">確認預約</h1>
        <p className="text-sm text-slate-600 mt-1">
          請核對預約資訊，完成校園帳號登入並同意使用規則後送出預約。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Reservation Summary with Edit Links */}
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
              預約資訊確認
            </h2>

            <div className="divide-y divide-slate-100">
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-500 w-20">預約日期</span>
                  <span className="font-mono-nums font-semibold text-slate-900">
                    {formatDateWithWeekday(date)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onJumpToStep('date-time')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer shrink-0"
                >
                  修改
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-500 w-20">預約時段</span>
                  <span className="font-mono-nums font-semibold text-slate-900">
                    {formatHour(startHour)} - {formatHour(endHour)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onJumpToStep('date-time')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer shrink-0"
                >
                  修改
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-500 w-20">樓層與區域</span>
                  <span className="font-semibold text-slate-900">
                    {floor} {zone}區
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onJumpToStep('floor-zone')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer shrink-0"
                >
                  修改
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <Armchair className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-500 w-20">座位</span>
                  <span className="font-mono-nums font-bold text-slate-900 text-base">
                    {seatId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onJumpToStep('seat-map')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer shrink-0"
                >
                  修改
                </button>
              </div>
            </div>
          </div>

          {/* Right: Campus Account Login */}
          <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">校園帳號登入</h2>
              <p className="text-xs text-slate-500 mt-0.5">登入後保留選位資料</p>
            </div>

            {user ? (
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-teal-700 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>已完成校園帳號驗證</span>
                </div>
                <div className="text-sm space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">學號</span>
                    <span className="font-mono-nums font-semibold text-slate-900">{user.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">姓名</span>
                    <span className="font-medium text-slate-900">{user.name}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
                >
                  切換其他帳號
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label htmlFor="confirm-student-id" className="sr-only">
                    校園帳號
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="confirm-student-id"
                      type="text"
                      value={studentIdInput}
                      onChange={(e) => setStudentIdInput(e.target.value)}
                      placeholder="校園帳號（學號）"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono-nums"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    密碼
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="confirm-password"
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="密碼"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleInlineLogin}
                  className="w-full py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  驗證校園帳號
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rules Agreement & Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-5">
          <div className="flex items-center justify-center gap-2">
            <input
              id="agree-rules"
              type="checkbox"
              checked={agreedRules}
              onChange={(e) => {
                setAgreedRules(e.target.checked);
                if (e.target.checked) setErrorMsg('');
              }}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
            />
            <label htmlFor="agree-rules" className="text-sm text-slate-700 cursor-pointer select-none">
              我已閱讀並同意
            </label>
            <button
              type="button"
              onClick={onOpenRules}
              className="text-sm font-semibold text-slate-900 underline underline-offset-4 hover:text-teal-700 cursor-pointer"
            >
              使用規則
            </button>
          </div>

          {errorMsg && (
            <p className="text-center text-xs font-medium text-red-600" role="alert">
              {errorMsg}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-44 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              返回上一步
            </button>
            <button
              type="submit"
              className="w-full sm:w-52 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              確認預約
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
