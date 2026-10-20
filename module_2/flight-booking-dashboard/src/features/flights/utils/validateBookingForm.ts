import type { BookingFormErrors, BookingFormValues } from '../types/flight';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBookingForm(
  values: BookingFormValues,
  maxSeats: number | null,
): BookingFormErrors {
  const errors: BookingFormErrors = {};
  const passengerName = values.passengerName.trim();
  const email = values.email.trim();
  const seats = Number(values.seats);

  if (values.flightId.length === 0) {
    errors.flightId = 'Please select a flight.';
  }

  if (passengerName.length === 0) {
    errors.passengerName = 'Passenger name is required.';
  } else if (passengerName.length < 2 || passengerName.length > 80) {
    errors.passengerName =
      'Passenger name must be between 2 and 80 characters.';
  }

  if (email.length === 0) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.seats.trim().length === 0) {
    errors.seats = 'Number of seats is required.';
  } else if (!Number.isInteger(seats) || seats < 1) {
    errors.seats = 'Seats must be a whole number of at least 1.';
  } else if (seats > 10) {
    errors.seats = 'You can book at most 10 seats per booking.';
  } else if (maxSeats !== null && seats > maxSeats) {
    errors.seats = `Only ${maxSeats} seat(s) remain on this flight.`;
  }

  return errors;
}
