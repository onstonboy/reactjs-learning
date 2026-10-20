import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Flight } from '../types/flight';
import { formatDateTime, formatPrice } from '../utils/format';

interface FlightCardProps {
  flight: Flight;
  onBook: (flight: Flight) => void;
}

export function FlightCard({ flight, onBook }: FlightCardProps) {
  const isSoldOut = flight.seatsAvailable === 0;
  const isBookable = !isSoldOut && flight.status !== 'Cancelled';
  const isLowSeats = flight.seatsAvailable > 0 && flight.seatsAvailable <= 10;

  return (
    <article className="flight-card">
      <div className="flight-card__header">
        <h3 className="flight-card__number">{flight.flightNumber}</h3>
        <StatusBadge status={flight.status} />
      </div>
      <p className="flight-card__airline">{flight.airline}</p>
      <p className="flight-card__route">
        <span>{flight.origin}</span>
        <span className="flight-card__route-arrow" aria-hidden="true">
          →
        </span>
        <span>{flight.destination}</span>
      </p>
      <p className="flight-card__times">
        Departs {formatDateTime(flight.departureTime)} · Arrives{' '}
        {formatDateTime(flight.arrivalTime)}
      </p>
      <div className="flight-card__meta">
        <span className="flight-card__price">{formatPrice(flight.price)}</span>
        <span
          className={`flight-card__seats${isLowSeats ? ' flight-card__seats--low' : ''}`}
        >
          {isSoldOut
            ? 'Sold out'
            : isLowSeats
              ? `Only ${flight.seatsAvailable} seats left`
              : `${flight.seatsAvailable} seats available`}
        </span>
      </div>
      <div className="flight-card__actions">
        <Button
          variant="secondary"
          disabled={!isBookable}
          onClick={() => onBook(flight)}
        >
          {flight.status === 'Cancelled'
            ? 'Cancelled'
            : isSoldOut
              ? 'Sold out'
              : 'Book'}
        </Button>
      </div>
    </article>
  );
}
