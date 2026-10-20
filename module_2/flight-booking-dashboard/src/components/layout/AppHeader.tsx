import type { Ref } from 'react';
import { Button } from '../ui/Button';

interface AppHeaderProps {
  onBookFlight: () => void;
  bookButtonRef?: Ref<HTMLButtonElement>;
}

export function AppHeader({ onBookFlight, bookButtonRef }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <span className="app-header__logo" aria-hidden="true">
            FB
          </span>
          <span className="app-header__title">Flight Booking Dashboard</span>
        </div>
        <Button onClick={onBookFlight} ref={bookButtonRef}>
          Book a flight
        </Button>
      </div>
    </header>
  );
}
