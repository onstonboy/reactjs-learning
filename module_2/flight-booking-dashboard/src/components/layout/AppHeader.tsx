import { Button } from '../ui/Button';

interface AppHeaderProps {
  onBookFlight: () => void;
  onAddFlight: () => void;
}

export function AppHeader({ onBookFlight, onAddFlight }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <span className="app-header__logo" aria-hidden="true">
            FB
          </span>
          <span className="app-header__title">Flight Booking Dashboard</span>
        </div>
        <div className="app-header__actions">
          <Button variant="secondary" onClick={onAddFlight}>
            Add a flight
          </Button>
          <Button onClick={onBookFlight}>Book a flight</Button>
        </div>
      </div>
    </header>
  );
}
