import { ArrowRight, Calendar } from 'lucide-react';
import {
  OPERATING_HOURS,
  ZONES,
  formatDateWithWeekday,
  formatHour,
  isZoneHourAvailable,
} from '../data/libraryData';
import { FloorId, Reservation, ZoneId } from '../types';

interface DateTimeStepProps {
  floor: FloorId;
  zone: ZoneId;
  date: string;
  startHour: number;
  endHour: number;
  reservations: Reservation[];
  onChangeDate: (date: string) => void;
  onChangeStartHour: (hour: number) => void;
  onChangeEndHour: (hour: number) => void;
  onSelectZone: (zone: ZoneId) => void;
  onNext: () => void;
}

export function DateTimeStep({
  floor,
  zone,
  date,
  startHour,
  endHour,
  reservations,
  onChangeDate,
  onChangeStartHour,
  onChangeEndHour,
  onSelectZone,
  onNext,
}: DateTimeStepProps) {
  const zones = ZONES[floor];

  // Display hours 08:00 - 21:00 (or focused window)
  const displayHours = OPERATING_HOURS;

  const handleStartChange = (newStart: number) => {
    onChangeStartHour(newStart);
    if (endHour <= newStart) {
      onChangeEndHour(Math.min(22, newStart + 1));
    }
  };

  const handleCellClick = (clickedZone: ZoneId, hour: number, available: boolean) => {
    if (!available) return;
    onSelectZone(clickedZone);
    onChangeStartHour(hour);
    onChangeEndHour(Math.min(22, hour + 2));
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">選擇日期與時段</h1>
        <p className="text-sm text-slate-600 mt-1">
          選擇預約日期與起訖時間，或直接點擊右側時段表選擇各區可預約時段。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls: Date & Time Pickers */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-6 h-fit">
          <div>
            <label htmlFor="booking-date" className="block text-sm font-semibold text-slate-900 mb-2">
              選擇日期
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="booking-date"
                type="date"
                value={date}
                min="2026-11-10"
                max="2026-11-30"
                onChange={(e) => e.target.value && onChangeDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm font-mono-nums border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5 font-mono-nums">
              已選：{formatDateWithWeekday(date)}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">選擇時段</h2>

            <div className="flex items-center justify-between gap-4">
              <label htmlFor="start-hour" className="text-sm text-slate-600 whitespace-nowrap">
                開始時間
              </label>
              <select
                id="start-hour"
                value={startHour}
                onChange={(e) => handleStartChange(Number(e.target.value))}
                className="w-36 px-3 py-2 text-sm font-mono-nums border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {OPERATING_HOURS.map((h) => (
                  <option key={h} value={h}>
                    {formatHour(h)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label htmlFor="end-hour" className="text-sm text-slate-600 whitespace-nowrap">
                結束時間
              </label>
              <select
                id="end-hour"
                value={endHour}
                onChange={(e) => onChangeEndHour(Number(e.target.value))}
                className="w-36 px-3 py-2 text-sm font-mono-nums border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {OPERATING_HOURS.filter((h) => h >= startHour).map((h) => (
                  <option key={h + 1} value={h + 1}>
                    {formatHour(h + 1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>目前樓層與區域</span>
              <span className="font-semibold text-slate-900">{floor} · {zone}區</span>
            </div>
            <div className="flex justify-between">
              <span>預約時長</span>
              <span className="font-mono-nums font-semibold text-slate-900">
                {endHour - startHour} 小時
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel: Hourly Zone Availability Grid */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {floor} 各區時段可預約狀態
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded border border-slate-300 bg-white inline-block" />
                  可預約
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded border border-slate-300 bg-hatched inline-block" />
                  不可預約
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded border-2 border-slate-900 bg-teal-50 inline-block" />
                  已選時段
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-2.5 px-4 text-left font-semibold text-slate-700 w-28">時間</th>
                    {zones.map((z) => (
                      <th
                        key={z.id}
                        className={`py-2.5 px-4 text-center font-semibold ${
                          z.id === zone ? 'text-slate-900 bg-slate-100' : 'text-slate-700'
                        }`}
                      >
                        {z.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayHours.map((hour) => (
                    <tr key={hour} className="border-b border-slate-100 last:border-b-0">
                      <td className="py-2 px-4 font-mono-nums text-xs font-medium text-slate-600 bg-slate-50/50 border-r border-slate-200">
                        {formatHour(hour)}
                      </td>
                      {zones.map((z) => {
                        const available = isZoneHourAvailable(date, floor, z.id, hour, reservations);
                        const isSelectedCell =
                          z.id === zone && hour >= startHour && hour < endHour;

                        return (
                          <td key={z.id} className="p-0 border-r border-slate-100 last:border-r-0">
                            <button
                              type="button"
                              disabled={!available}
                              onClick={() => handleCellClick(z.id, hour, available)}
                              aria-label={`${z.name} ${formatHour(hour)} ${available ? '可預約' : '不可預約'}`}
                              className={`w-full h-9 text-xs font-medium transition-colors flex items-center justify-center ${
                                !available
                                  ? 'bg-hatched text-slate-400 cursor-not-allowed'
                                  : isSelectedCell
                                    ? 'bg-teal-50 text-slate-900 font-semibold ring-2 ring-inset ring-slate-900 cursor-pointer'
                                    : 'bg-white hover:bg-slate-50 text-slate-600 cursor-pointer'
                              }`}
                            >
                              {isSelectedCell ? '已選' : available ? '可預約' : '額滿'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <span>查看可用座位</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
