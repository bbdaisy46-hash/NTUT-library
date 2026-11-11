import { ArrowRight, Plug, Sparkles } from 'lucide-react';
import {
  formatDateWithWeekday,
  formatHour,
  getSeatsForZone,
  isSeatAvailable,
} from '../data/libraryData';
import { FloorId, Reservation, ZoneId } from '../types';

interface SeatMapStepProps {
  floor: FloorId;
  zone: ZoneId;
  date: string;
  startHour: number;
  endHour: number;
  selectedSeatId: string | null;
  reservations: Reservation[];
  onSelectSeat: (seatId: string) => void;
  onBackToFloorZone: () => void;
  onBackToDateTime: () => void;
  onNext: () => void;
}

export function SeatMapStep({
  floor,
  zone,
  date,
  startHour,
  endHour,
  selectedSeatId,
  reservations,
  onSelectSeat,
  onBackToFloorZone,
  onBackToDateTime,
  onNext,
}: SeatMapStepProps) {
  const seats = getSeatsForZone(floor, zone);
  const selectedSeat = seats.find((s) => s.id === selectedSeatId) ?? null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">選擇座位</h1>
        <p className="text-sm text-slate-600 mt-1">
          在平面圖上點選可預約座位，右側將顯示座位詳細資訊。
        </p>
      </div>

      {/* Top Context Bar matching Wireframe 04 */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 mb-6 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-700">
          <div>
            <span className="text-slate-500">樓層：</span>
            <span className="font-mono-nums font-semibold text-slate-900">{floor}</span>
          </div>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
          <div>
            <span className="text-slate-500">區域：</span>
            <span className="font-semibold text-slate-900">{zone}區</span>
          </div>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
          <div>
            <span className="text-slate-500">預約時段：</span>
            <span className="font-mono-nums font-semibold text-slate-900">
              {formatDateWithWeekday(date)} {formatHour(startHour)} - {formatHour(endHour)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            type="button"
            onClick={onBackToFloorZone}
            className="text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
          >
            更換樓層區域
          </button>
          <button
            type="button"
            onClick={onBackToDateTime}
            className="text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
          >
            更換時段
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Architectural Seat Map */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 sm:p-8 relative">
            {/* Architectural Perimeter Labels */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
              <span>靠窗採光區</span>
              <span>書架通道</span>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
              {seats.map((seat) => {
                const available = isSeatAvailable(
                  date,
                  floor,
                  zone,
                  seat.id,
                  startHour,
                  endHour,
                  reservations
                );
                const isSelected = selectedSeatId === seat.id && available;

                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={!available}
                    onClick={() => onSelectSeat(seat.id)}
                    aria-pressed={isSelected}
                    aria-label={`座位 ${seat.id}，${!available ? '不可選' : isSelected ? '已選' : '可選'}`}
                    className={`h-14 sm:h-16 rounded-lg border font-mono-nums text-sm font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                      !available
                        ? 'bg-hatched border-slate-300 text-slate-400 cursor-not-allowed'
                        : isSelected
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm cursor-pointer'
                          : 'bg-white border-slate-300 text-slate-800 hover:border-slate-900 hover:shadow-xs cursor-pointer'
                    }`}
                  >
                    <span>{seat.id}</span>
                    {seat.hasPower && (
                      <Plug
                        className={`w-3 h-3 ${
                          !available
                            ? 'text-slate-300'
                            : isSelected
                              ? 'text-teal-300'
                              : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Service Pillar & Entrance matching Wireframe 04 */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border border-slate-300 bg-white inline-block" aria-hidden="true" />
                <span>圓柱 / 照明控制</span>
              </div>
              <div className="px-3 py-1 border border-slate-300 bg-white rounded text-slate-700 font-medium">
                出入口
              </div>
            </div>
          </div>

          {/* Legend matching Wireframe 04 */}
          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded border border-slate-300 bg-white inline-block" />
              可選
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded border border-slate-300 bg-hatched inline-block" />
              不可選
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded border border-slate-900 bg-slate-900 inline-block" />
              已選
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-500 sm:ml-auto">
              <Plug className="w-3.5 h-3.5" />
              附電源插座
            </span>
          </div>
        </div>

        {/* Right: Selected Seat Detail & Next CTA */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-fit lg:sticky lg:top-24">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">目前選擇座位</p>
            {selectedSeat ? (
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold font-mono-nums text-slate-900 tracking-tight">
                    {selectedSeat.id}
                  </div>
                  <p className="text-sm font-medium text-slate-600 mt-1">
                    {floor} · {zone}區
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">座位類型</span>
                    <span className="font-medium text-slate-900">{selectedSeat.typeLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">預約日期</span>
                    <span className="font-mono-nums font-medium text-slate-900">
                      {formatDateWithWeekday(date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">預約時段</span>
                    <span className="font-mono-nums font-medium text-slate-900">
                      {formatHour(startHour)} - {formatHour(endHour)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50">
                <Sparkles className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">請於左側平面圖點選座位</p>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!selectedSeat}
            onClick={onNext}
            className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-lg transition-colors ${
              selectedSeat
                ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>下一步</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
