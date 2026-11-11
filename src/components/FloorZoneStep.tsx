import { ArrowRight } from 'lucide-react';
import { FLOORS, ZONES, getSeatsForZone, getZoneAvailableCount, isSeatAvailable } from '../data/libraryData';
import { FloorId, Reservation, ZoneId } from '../types';

interface FloorZoneStepProps {
  floor: FloorId;
  zone: ZoneId;
  date: string;
  startHour: number;
  endHour: number;
  reservations: Reservation[];
  onSelectFloor: (floor: FloorId) => void;
  onSelectZone: (zone: ZoneId) => void;
  onNext: () => void;
}

export function FloorZoneStep({
  floor,
  zone,
  date,
  startHour,
  endHour,
  reservations,
  onSelectFloor,
  onSelectZone,
  onNext,
}: FloorZoneStepProps) {
  const currentZones = ZONES[floor];
  const previewSeats = getSeatsForZone(floor, zone);
  const selectedZoneInfo = currentZones.find((z) => z.id === zone) ?? currentZones[0];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">查看座位與樓層配置</h1>
        <p className="text-sm text-slate-600 mt-1">
          選擇樓層（B1、2F）與區域，查看各區目前剩餘座位與空間配置概覽。
        </p>
      </div>

      {/* Floor Segmented Tabs */}
      <div className="inline-flex items-center p-1 bg-slate-200/70 rounded-lg mb-6" role="tablist" aria-label="選擇樓層">
        {FLOORS.map((f) => {
          const active = f.id === floor;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelectFloor(f.id)}
              className={`px-6 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Zone Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {currentZones.map((z) => {
          const available = getZoneAvailableCount(date, floor, z.id, startHour, endHour, reservations);
          const isSelected = z.id === zone;

          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onSelectZone(z.id)}
              className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-slate-900 ring-1 ring-slate-900 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <span className="text-lg font-bold text-slate-900">{z.name}</span>
                <span className="text-sm font-medium text-slate-700 font-mono-nums">
                  剩餘 <span className="text-base font-bold text-teal-700">{available}</span> 席
                </span>
              </div>
              <p className="text-xs text-slate-600">{z.description}</p>
              <p className="text-xs text-slate-500 mt-1.5">{z.features}</p>
            </button>
          );
        })}
      </div>

      {/* Spatial Overview + CTA */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              目前空位（{floor} · {selectedZoneInfo.name}）
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{selectedZoneInfo.description}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded border border-slate-400 bg-white inline-block" />
              可預約
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded border border-slate-300 bg-hatched inline-block" />
              使用中 / 已預約
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Architectural Preview Map */}
          <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-lg p-6 relative">
            <div className="text-[11px] text-slate-400 font-medium mb-3 flex justify-between">
              <span>靠窗採光側</span>
              <span>北側書架區</span>
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto py-4">
              {previewSeats.map((s) => {
                const avail = isSeatAvailable(date, floor, zone, s.id, startHour, endHour, reservations);
                return (
                  <div
                    key={s.id}
                    className={`h-11 rounded-md border flex items-center justify-center font-mono-nums text-xs font-medium ${
                      avail
                        ? 'bg-white border-slate-300 text-slate-700'
                        : 'bg-hatched border-slate-300 text-slate-400'
                    }`}
                    title={`${s.id} (${avail ? '可預約' : '不可選'})`}
                  >
                    {s.id}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>樓層服務台</span>
              <span className="font-medium text-slate-600">出入口</span>
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-5">
            <div className="space-y-2 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">已選空間</p>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>樓層</span>
                <span className="font-mono-nums font-semibold text-slate-900">{floor}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>區域</span>
                <span className="font-semibold text-slate-900">{selectedZoneInfo.name}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>總席次</span>
                <span className="font-mono-nums text-slate-900">{selectedZoneInfo.totalSeats} 席</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onNext}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <span>選擇日期與時段</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
