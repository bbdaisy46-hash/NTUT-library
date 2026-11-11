import { Armchair, Calendar, CheckCircle2, Clock, Info, MapPin } from 'lucide-react';
import { formatDateWithWeekday, formatHour, getSeatsForZone } from '../data/libraryData';
import { Reservation } from '../types';

interface CompleteStepProps {
  reservation: Reservation;
  onViewMyReservations: () => void;
  onBackHome: () => void;
}

export function CompleteStep({
  reservation,
  onViewMyReservations,
  onBackHome,
}: CompleteStepProps) {
  const zoneSeats = getSeatsForZone(reservation.floor, reservation.zone);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 text-teal-700 mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            預約成功
          </h1>
          <p className="text-xs font-mono-nums text-slate-500 mt-1.5">
            預約編號：{reservation.code}
          </p>
        </div>

        {/* Details + Mini Seat Position Map */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
          <div className="md:col-span-6 divide-y divide-slate-100 border-t border-b border-slate-200">
            <div className="py-3.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2.5 text-slate-500">
                <Calendar className="w-4 h-4" />
                預約日期
              </span>
              <span className="font-mono-nums font-semibold text-slate-900">
                {formatDateWithWeekday(reservation.date)}
              </span>
            </div>
            <div className="py-3.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2.5 text-slate-500">
                <Clock className="w-4 h-4" />
                預約時段
              </span>
              <span className="font-mono-nums font-semibold text-slate-900">
                {formatHour(reservation.startHour)} - {formatHour(reservation.endHour)}
              </span>
            </div>
            <div className="py-3.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2.5 text-slate-500">
                <MapPin className="w-4 h-4" />
                樓層區域
              </span>
              <span className="font-semibold text-slate-900">
                {reservation.floor} {reservation.zone}區
              </span>
            </div>
            <div className="py-3.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2.5 text-slate-500">
                <Armchair className="w-4 h-4" />
                座位
              </span>
              <span className="font-mono-nums font-bold text-slate-900 text-base">
                {reservation.seatId}
              </span>
            </div>
          </div>

          {/* Mini Floorplan Highlighting Booked Seat */}
          <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h2 className="text-xs font-semibold text-slate-700 mb-3">
              座位位置示意（{reservation.floor} {reservation.zone}區）
            </h2>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto py-2">
              {zoneSeats.map((s) => {
                const isBooked = s.id === reservation.seatId;
                return (
                  <div
                    key={s.id}
                    className={`h-8 rounded border flex items-center justify-center font-mono-nums text-[11px] font-semibold ${
                      isBooked
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {isBooked ? s.id : ''}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-2 border-t border-dashed border-slate-200 flex justify-between text-[11px] text-slate-500">
              <span>靠窗側</span>
              <span>出入口</span>
            </div>
          </div>
        </div>

        {/* Check-in Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 flex items-start gap-2.5 text-sm text-slate-700 mb-8">
          <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
          <span>
            請依館方規定於期限內刷卡報到（預約時段開始前 15 分鐘至開始後 15 分鐘內）。
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onViewMyReservations}
            className="w-full sm:w-48 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            查看我的預約
          </button>
          <button
            type="button"
            onClick={onBackHome}
            className="w-full sm:w-48 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            返回首頁
          </button>
        </div>
      </div>
    </section>
  );
}
