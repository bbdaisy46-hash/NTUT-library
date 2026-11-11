import { FloorId, Reservation, SeatInfo, ZoneId, ZoneInfo } from '../types';

export const FLOORS: { id: FloorId; label: string; subtitle: string }[] = [
  { id: 'B1', label: 'B1', subtitle: '靜音自習與個人閱覽區' },
  { id: '2F', label: '2F', subtitle: '綜合閱覽與數位學習區' },
];

export const ZONES: Record<FloorId, ZoneInfo[]> = {
  B1: [
    {
      id: 'A',
      name: 'A區',
      floor: 'B1',
      description: '個人靜音閱覽席 · 鄰近靠窗採光',
      totalSeats: 16,
      baseAvailable: 14,
      features: '附電源插座 · 桌面隔板',
    },
    {
      id: 'B',
      name: 'B區',
      floor: 'B1',
      description: '標準長桌閱覽席 · 中央安靜區',
      totalSeats: 16,
      baseAvailable: 12,
      features: '雙向電源 · 檯燈照明',
    },
    {
      id: 'C',
      name: 'C區',
      floor: 'B1',
      description: '深讀研究專區 · 單人獨立席',
      totalSeats: 16,
      baseAvailable: 8,
      features: '獨立檯燈 · 禁止鍵盤聲',
    },
  ],
  '2F': [
    {
      id: 'A',
      name: 'A區',
      floor: '2F',
      description: '開放閱覽區 · 筆電友善座位',
      totalSeats: 16,
      baseAvailable: 15,
      features: '高速 Wi-Fi · 電源插座',
    },
    {
      id: 'B',
      name: 'B區',
      floor: '2F',
      description: '期刊與參考書閱覽席',
      totalSeats: 16,
      baseAvailable: 10,
      features: '寬敞桌面 · 自然採光',
    },
    {
      id: 'C',
      name: 'C區',
      floor: '2F',
      description: '數位學習與多媒體輔助區',
      totalSeats: 16,
      baseAvailable: 6,
      features: '雙螢幕支架 · 電源插座',
    },
  ],
};

export const OPERATING_HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 08 to 21 (slots 08:00-09:00 ... 21:00-22:00)

export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function formatDateWithWeekday(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const wd = weekdays[date.getDay()];
  return `${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')} (${wd})`;
}

export function getSeatsForZone(floor: FloorId, zone: ZoneId): SeatInfo[] {
  const seats: SeatInfo[] = [];
  for (let i = 1; i <= 16; i++) {
    const row = Math.floor((i - 1) / 4);
    const col = (i - 1) % 4;
    const isWindow = row === 0 || col === 0;
    const hasPower = i % 2 === 0 || row === 0;
    seats.push({
      id: `${zone}${String(i).padStart(2, '0')}`,
      zone,
      floor,
      row,
      col,
      isWindow,
      hasPower,
      typeLabel: isWindow ? '靠窗個人席 · 附電源插座' : hasPower ? '標準閱覽席 · 附電源插座' : '標準閱覽席',
    });
  }
  return seats;
}

// Deterministic hash so availability feels realistic and consistent across dates/hours
function simpleHash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Returns whether a zone has available seats at a specific date & hour.
 */
export function isZoneHourAvailable(
  date: string,
  floor: FloorId,
  zone: ZoneId,
  hour: number,
  reservations: Reservation[]
): boolean {
  const seats = getSeatsForZone(floor, zone);
  const availableCount = seats.filter((s) =>
    isSeatAvailable(date, floor, zone, s.id, hour, hour + 1, reservations)
  ).length;
  return availableCount > 0;
}

/**
 * Returns whether a specific seat is available across [startHour, endHour).
 */
export function isSeatAvailable(
  date: string,
  floor: FloorId,
  zone: ZoneId,
  seatId: string,
  startHour: number,
  endHour: number,
  reservations: Reservation[]
): boolean {
  // Check user's active reservations first
  const hasConflict = reservations.some(
    (r) =>
      r.status !== 'cancelled' &&
      r.date === date &&
      r.floor === floor &&
      r.zone === zone &&
      r.seatId === seatId &&
      Math.max(r.startHour, startHour) < Math.min(r.endHour, endHour)
  );
  if (hasConflict) return false;

  // Deterministic baseline occupancy matching wireframe feel (e.g. A02, A07 unavailable on default)
  if (floor === 'B1' && zone === 'A' && (seatId === 'A02' || seatId === 'A07')) {
    return false;
  }

  for (let h = startHour; h < endHour; h++) {
    const hash = simpleHash(`${date}-${floor}-${zone}-${seatId}-${h}`);
    // Roughly 18-30% occupancy depending on zone & peak hours (13-17)
    const peakBoost = h >= 13 && h <= 17 ? 10 : 0;
    const zoneBias = zone === 'C' ? 14 : zone === 'B' ? 8 : 0;
    if (hash % 100 < 12 + peakBoost + zoneBias) {
      return false;
    }
  }
  return true;
}

export function getZoneAvailableCount(
  date: string,
  floor: FloorId,
  zone: ZoneId,
  startHour: number,
  endHour: number,
  reservations: Reservation[]
): number {
  const seats = getSeatsForZone(floor, zone);
  return seats.filter((s) =>
    isSeatAvailable(date, floor, zone, s.id, startHour, endHour, reservations)
  ).length;
}
