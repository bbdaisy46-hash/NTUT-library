import { useState, useEffect } from 'react';
import { X, Lock, User, BookCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BookCheck className="w-5 h-5 text-slate-900" />
            <h2 id="rules-modal-title" className="text-base font-bold text-slate-900">
              北科圖書館座位使用規則
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="關閉"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">1. 開放與預約時間</h3>
            <p className="text-slate-600">
              本館閱覽室每日 08:00 至 22:00 開放預約使用，每次預約以小時為單位，單日累計預約上限為 6 小時。
            </p>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-semibold text-slate-900 mb-1">2. 刷卡報到與逾時規定</h3>
            <p className="text-slate-600">
              請於預約時段開始前 15 分鐘至開始後 15 分鐘內，持學生證或校園行動條碼於各樓層報到機完成刷卡報到。逾時未報到者，系統將自動取消該筆預約並釋出座位。
            </p>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-semibold text-slate-900 mb-1">3. 暫離與離席規範</h3>
            <p className="text-slate-600">
              使用期間如需暫離請勿超過 30 分鐘；若提前結束使用，請於系統或報到機辦理離席，以利其他同學使用。
            </p>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-semibold text-slate-900 mb-1">4. 閱覽室禮儀</h3>
            <p className="text-slate-600">
              B1 靜音自習區請將手機調至靜音，禁止飲食（白開水除外）及大聲交談；2F 數位學習區可使用筆電，請避免影響鄰座同學。
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            我瞭解了
          </button>
        </div>
      </div>
    </div>
  );
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (account: UserAccount) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [studentId, setStudentId] = useState('112360001');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = studentId.trim();
    if (!trimmed) {
      setError('請輸入校園學號或帳號');
      return;
    }
    if (!password.trim()) {
      setError('請輸入密碼');
      return;
    }
    setError('');
    onLogin({
      studentId: trimmed,
      name: trimmed === '112360001' ? '林北科' : '同學',
      department: '資訊工程系',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 id="login-modal-title" className="text-base font-bold text-slate-900">
            校園帳號登入
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="關閉"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            請使用國立臺北科技大學校園入口網帳號登入，系統將保留您目前的選位資料。
          </p>

          <div>
            <label htmlFor="modal-student-id" className="block text-xs font-medium text-slate-700 mb-1.5">
              校園帳號（學號）
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="modal-student-id"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="例如：112360001"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-mono-nums"
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-password" className="block text-xs font-medium text-slate-700 mb-1.5">
              密碼
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="modal-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              登入帳號
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
