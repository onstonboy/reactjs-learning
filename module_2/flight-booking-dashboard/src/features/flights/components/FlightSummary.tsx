interface FlightSummaryProps {
  totalFlights: number;
  totalSeats: number;
  totalBookings: number;
}

export function FlightSummary({
  totalFlights,
  totalSeats,
  totalBookings,
}: FlightSummaryProps) {
  return (
    <div className="summary" aria-label="Flight summary">
      <div className="summary__item">
        <span className="summary__value">{totalFlights}</span>
        <span className="summary__label">
          {totalFlights === 1 ? 'flight' : 'flights'}
        </span>
      </div>
      <div className="summary__item">
        <span className="summary__value">{totalSeats}</span>
        <span className="summary__label">seats left</span>
      </div>
      <div className="summary__item">
        <span className="summary__value">{totalBookings}</span>
        <span className="summary__label">
          {totalBookings === 1 ? 'booking' : 'bookings'}
        </span>
      </div>
    </div>
  );
}
