import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Flight, FlightStatus } from '../types/flight';
import { formatDateTime, formatPrice } from '../utils/format';

const STATUS_OPTIONS: FlightStatus[] = [
  'Scheduled',
  'Boarding',
  'Delayed',
  'Cancelled',
];

interface FlightDetailsProps {
  flight: Flight;
  isUpdatingStatus: boolean;
  onUpdateStatus: (flightId: string, status: FlightStatus) => void;
  onBook: (flight: Flight) => void;
  onClose: () => void;
}

export function FlightDetails({
  flight,
  isUpdatingStatus,
  onUpdateStatus,
  onBook,
  onClose,
}: FlightDetailsProps) {
  const isSoldOut = flight.seatsAvailable === 0;
  const isBookable = !isSoldOut && flight.status !== 'Cancelled';

  return (
    <section className="flight-details" aria-labelledby="flight-details-title">
      <div className="flight-details__header">
        <h2 className="flight-details__title" id="flight-details-title">
          Flight details
        </h2>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="flight-details__heading">
        <h3 className="flight-details__number">{flight.flightNumber}</h3>
        <StatusBadge status={flight.status} />
      </div>
      <p className="flight-details__airline">{flight.airline}</p>

      <dl className="flight-details__grid">
        <div className="flight-details__item">
          <dt>Route</dt>
          <dd>
            {flight.origin} → {flight.destination}
          </dd>
        </div>
        <div className="flight-details__item">
          <dt>Departure</dt>
          <dd>{formatDateTime(flight.departureTime)}</dd>
        </div>
        <div className="flight-details__item">
          <dt>Arrival</dt>
          <dd>{formatDateTime(flight.arrivalTime)}</dd>
        </div>
        <div className="flight-details__item">
          <dt>Price</dt>
          <dd>{formatPrice(flight.price)}</dd>
        </div>
        <div className="flight-details__item">
          <dt>Seats available</dt>
          <dd>{flight.seatsAvailable}</dd>
        </div>
      </dl>

      <div className="flight-details__status">
        <label
          className="flight-details__status-label"
          htmlFor="flight-status-update"
        >
          Update status
        </label>
        <select
          id="flight-status-update"
          className="control__select"
          value={flight.status}
          disabled={isUpdatingStatus}
          onChange={(event) =>
            onUpdateStatus(flight.id, event.target.value as FlightStatus)
          }
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <Button
        variant="primary"
        disabled={!isBookable}
        onClick={() => onBook(flight)}
      >
        {flight.status === 'Cancelled'
          ? 'Cancelled'
          : isSoldOut
            ? 'Sold out'
            : 'Book this flight'}
      </Button>
    </section>
  );
}
