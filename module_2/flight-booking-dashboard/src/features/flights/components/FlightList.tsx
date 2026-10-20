import type { Flight } from '../types/flight';
import { FlightCard } from './FlightCard';

interface FlightListProps {
  flights: Flight[];
  onBook: (flight: Flight) => void;
}

export function FlightList({ flights, onBook }: FlightListProps) {
  return (
    <ul className="flight-grid" role="list">
      {flights.map((flight) => (
        <li key={flight.id}>
          <FlightCard flight={flight} onBook={onBook} />
        </li>
      ))}
    </ul>
  );
}
