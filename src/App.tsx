import { useEffect, useState } from 'react';
import { CompleteStep } from './components/CompleteStep';
import { ConfirmStep } from './components/ConfirmStep';
import { DateTimeStep } from './components/DateTimeStep';
import { FloorZoneStep } from './components/FloorZoneStep';
import { HomeStep } from './components/HomeStep';
import { LoginModal, RulesModal } from './components/Modals';
import { MyReservationsView } from './components/MyReservationsView';
import { SeatMapStep } from './components/SeatMapStep';
import { StepIndicator } from './components/StepIndicator';
import { TopBar } from './components/TopBar';
import { isSeatAvailable } from './data/libraryData';
import { AppView, FloorId, Reservation, UserAccount, ZoneId } from './types';

const STORAGE_RESERVATIONS_KEY = 'ntut_library_reservations_v1';
const STORAGE_USER_KEY = 'ntut_library_user_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  // Booking draft state
  const [floor, setFloor] = useState<FloorId>('B1');
  const [zone, setZone] = useState<ZoneId>('A');
  const [date, setDate] = useState<string>('2026-11-12');
  const [startHour, setStartHour] = useState<number>(14);
  const [endHour, setEndHour] = useState<number>(16);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

  // Completed reservation for Screen 06
  const [latestReservation, setLatestReservation] = useState<Reservation | null>(null);

  // Persistent user & reservations
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? (JSON.parse(saved) as UserAccount) : null;
    } catch {
      return null;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RESERVATIONS_KEY);
      return saved ? (JSON.parse(saved) as Reservation[]) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RESERVATIONS_KEY, JSON.stringify(reservations));
    } catch {
      // Ignore storage quota errors
    }
  }, [reservations]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [user]);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFloor = (newFloor: FloorId) => {
    setFloor(newFloor);
    setSelectedSeatId(null);
  };

  const handleSelectZone = (newZone: ZoneId) => {
    setZone(newZone);
    setSelectedSeatId(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedSeatId || !user) return;
    // Double check seat availability
    if (!isSeatAvailable(date, floor, zone, selectedSeatId, startHour, endHour, reservations)) {
      navigateTo('seat-map');
      return;
    }

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      code: `NTUT-${date.replace(/-/g, '')}-${selectedSeatId}`,
      date,
      startHour,
      endHour,
      floor,
      zone,
      seatId: selectedSeatId,
      studentId: user.studentId,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };

    setReservations((prev) => [newReservation, ...prev]);
    setLatestReservation(newReservation);
    navigateTo('complete');
  };

  const handleCheckIn = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'checked-in' } : r))
    );
  };

  const handleCancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );
  };

  const activeReservationCount = reservations.filter((r) => r.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <TopBar
        currentView={currentView}
        user={user}
        reservationCount={activeReservationCount}
        onNavigate={navigateTo}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={() => setUser(null)}
      />

      <StepIndicator currentView={currentView} onNavigate={navigateTo} />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomeStep
            onStartBooking={() => navigateTo('floor-zone')}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}

        {currentView === 'floor-zone' && (
          <FloorZoneStep
            floor={floor}
            zone={zone}
            date={date}
            startHour={startHour}
            endHour={endHour}
            reservations={reservations}
            onSelectFloor={handleSelectFloor}
            onSelectZone={handleSelectZone}
            onNext={() => navigateTo('date-time')}
          />
        )}

        {currentView === 'date-time' && (
          <DateTimeStep
            floor={floor}
            zone={zone}
            date={date}
            startHour={startHour}
            endHour={endHour}
            reservations={reservations}
            onChangeDate={(d) => {
              setDate(d);
              setSelectedSeatId(null);
            }}
            onChangeStartHour={(h) => {
              setStartHour(h);
              setSelectedSeatId(null);
            }}
            onChangeEndHour={(h) => {
              setEndHour(h);
              setSelectedSeatId(null);
            }}
            onSelectZone={handleSelectZone}
            onNext={() => navigateTo('seat-map')}
          />
        )}

        {currentView === 'seat-map' && (
          <SeatMapStep
            floor={floor}
            zone={zone}
            date={date}
            startHour={startHour}
            endHour={endHour}
            selectedSeatId={selectedSeatId}
            reservations={reservations}
            onSelectSeat={setSelectedSeatId}
            onBackToFloorZone={() => navigateTo('floor-zone')}
            onBackToDateTime={() => navigateTo('date-time')}
            onNext={() => navigateTo('confirm')}
          />
        )}

        {currentView === 'confirm' && selectedSeatId && (
          <ConfirmStep
            floor={floor}
            zone={zone}
            date={date}
            startHour={startHour}
            endHour={endHour}
            seatId={selectedSeatId}
            user={user}
            onLogin={setUser}
            onLogout={() => setUser(null)}
            onJumpToStep={navigateTo}
            onOpenRules={() => setIsRulesOpen(true)}
            onBack={() => navigateTo('seat-map')}
            onConfirm={handleConfirmBooking}
          />
        )}

        {currentView === 'complete' && latestReservation && (
          <CompleteStep
            reservation={latestReservation}
            onViewMyReservations={() => navigateTo('my-reservations')}
            onBackHome={() => {
              setSelectedSeatId(null);
              navigateTo('home');
            }}
          />
        )}

        {currentView === 'my-reservations' && (
          <MyReservationsView
            reservations={reservations}
            onCheckIn={handleCheckIn}
            onCancel={handleCancelReservation}
            onStartNewBooking={() => {
              setSelectedSeatId(null);
              navigateTo('floor-zone');
            }}
          />
        )}
      </main>

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={setUser}
      />
    </div>
  );
}
