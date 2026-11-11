export type FloorId = 'B1' | '2F';
export type ZoneId = 'A' | 'B' | 'C';

export type AppView =
  | 'home'          // 01 進入網站
  | 'floor-zone'    // 02 查看座位
  | 'date-time'     // 03 選擇日期與時段
  | 'seat-map'      // 04 選擇座位
  | 'confirm'       // 05 確認預約
  | 'complete'      // 06 預約完成
  | 'my-reservations';

export interface ZoneInfo {
  id: ZoneId;
  name: string;
  floor: FloorId;
  description: string;
  totalSeats: number;
  baseAvailable: number;
  features: string;
}

export interface SeatInfo {
  id: string;
  zone: ZoneId;
  floor: FloorId;
  row: number;
  col: number;
  isWindow?: boolean;
  hasPower?: boolean;
  typeLabel: string;
}

export interface UserAccount {
  studentId: string;
  name: string;
  department: string;
}

export type ReservationStatus = 'upcoming' | 'checked-in' | 'cancelled';

export interface Reservation {
  id: string;
  code: string;
  date: string;       // YYYY-MM-DD
  startHour: number;  // e.g. 14
  endHour: number;    // e.g. 16
  floor: FloorId;
  zone: ZoneId;
  seatId: string;
  studentId: string;
  status: ReservationStatus;
  createdAt: string;
}
