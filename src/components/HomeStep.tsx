import { ArrowRight, Clock, FileText } from 'lucide-react';

interface HomeStepProps {
  onStartBooking: () => void;
  onOpenRules: () => void;
}

export function HomeStep({ onStartBooking, onOpenRules }: HomeStepProps) {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-slate-50">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
        <div className="w-full max-w-2xl text-center">
          <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-wide mb-4">
            國立臺北科技大學圖書館 · 線上閱覽座位系統
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-5 [text-wrap:balance]">
            找個座位，開始學習
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
            線上預約圖書館閱覽座位，即時查看各樓層剩餘席次，輕鬆安排你的學習時段
          </p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onStartBooking}
              className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] rounded-xl transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              <span>查看座位</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar matching Wireframe 01 */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              開放時間：每日 <span className="font-mono-nums font-medium text-slate-900">08:00 - 22:00</span>
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">|</span>
          <button
            type="button"
            onClick={onOpenRules}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
            <span>使用規則</span>
          </button>
        </div>
      </div>
    </section>
  );
}
