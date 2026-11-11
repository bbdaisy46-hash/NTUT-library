import { useState } from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, Plus, XCircle } from 'lucide-react';
import { formatDateWithWeekday, formatHour } from '../data/libraryData';
import { Reservation, ReservationStatus } from '../types';

interface MyReservationsViewProps {
  reservations: Reservation[];
  onCheckIn: (id: string) => void;
  onCancel: (id: string) => void;
  onStartNewBooking: () => void;
}

type FilterTab = 'all' | ReservationStatus;

const STATUS_LABELS: Record<ReservationStatus, string> = {
  upcoming: '待報到',
  'checked-in': '已報到',
  cancelled: '已取消',
};

export function MyReservationsView({
  reservations,
  onCheckIn,
  onCancel,
  onStartNewBooking,
}: MyReservationsViewProps) {
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered =
    filter === 'all' ? reservations : reservations.filter((r) => r.status === filter);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">我的預約</h1>
          <p className="text-sm text-slate-600 mt-1">
            查看您的圖書館座位預約紀錄，並可於此進行刷卡報到或取消預約。
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNewBooking}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>新增預約</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg mb-6">
        {(
          [
            { key: 'all', label: '全部' },
            { key: 'upcoming', label: '待報到' },
            { key: 'checked-in', label: '已報到' },
            { key: 'cancelled', label: '已取消' },
          ] as { key: FilterTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              filter === tab.key
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-base font-semibold text-slate-900 mb-1">目前沒有符合條件的預約紀錄</p>
          <p className="text-sm text-slate-500 mb-6">
            您可以立即前往選擇樓層、時段與閱覽座位。
          </p>
          <button
            type="button"
            onClick={onStartNewBooking}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            查看可用座位
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-lg font-bold font-mono-nums text-slate-900">
                    {res.floor} · {res.zone}區 · {res.seatId}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      res.status === 'upcoming'
                        ? 'text-teal-700'
                        : res.status === 'checked-in'
                          ? 'text-slate-700'
                          : 'text-slate-400'
                    }`}
                  >
                    · {STATUS_LABELS[res.status]}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600 font-mono-nums">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDateWithWeekday(res.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatHour(res.startHour)} - {formatHour(res.endHour)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    編號 {res.code}
                  </span>
                </div>
              </div>

              {res.status === 'upcoming' && (
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onCheckIn(res.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>報到</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onCancel(res.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>取消預約</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
