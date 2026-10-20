import type { Flight } from '../types/flight';
import { FlightCard } from './FlightCard';

interface FlightListProps {
  flights: Flight[];
  selectedFlightId: string | null;
  onSelect: (flight: Flight) => void;
  onBook: (flight: Flight) => void;
}

export function FlightList({
  flights,
  selectedFlightId,
  onSelect,
  onBook,
}: FlightListProps) {
  return (
    <ul className="flight-grid" role="list">
      {flights.map((flight) => (
        <li key={flight.id}>
          <FlightCard
            flight={flight}
            isSelected={flight.id === selectedFlightId}
            onSelect={onSelect}
            onBook={onBook}
          />
        </li>
      ))}
    </ul>
  );
}
