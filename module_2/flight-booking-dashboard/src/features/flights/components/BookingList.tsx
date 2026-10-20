import type { Booking } from '../types/flight';
import { formatPrice } from '../utils/format';

interface BookingListProps {
  bookings: Booking[];
}

export function BookingList({ bookings }: BookingListProps) {
  return (
    <section className="bookings" aria-labelledby="bookings-title">
      <h2 className="bookings__title" id="bookings-title">
        Your bookings ({bookings.length})
      </h2>
      <div className="bookings__scroll">
        <table className="bookings__table">
          <caption className="visually-hidden">
            Bookings made during this session
          </caption>
          <thead>
            <tr>
              <th scope="col">Reference</th>
              <th scope="col">Passenger</th>
              <th scope="col">Flight</th>
              <th scope="col">Seats</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.passengerName}</td>
                <td>
                  {booking.flightNumber} — {booking.route}
                </td>
                <td>{booking.seats}</td>
                <td>{formatPrice(booking.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
