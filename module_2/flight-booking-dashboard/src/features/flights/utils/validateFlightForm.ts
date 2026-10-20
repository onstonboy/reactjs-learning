import type { FlightFormErrors, FlightFormValues } from '../types/flight';

const FLIGHT_STATUSES = [
  'Scheduled',
  'Boarding',
  'Delayed',
  'Cancelled',
] as const;

export function validateFlightForm(values: FlightFormValues): FlightFormErrors {
  const errors: FlightFormErrors = {};
  const price = Number(values.price);
  const seats = Number(values.seatsAvailable);
  const departure = new Date(values.departureTime);
  const arrival = new Date(values.arrivalTime);

  if (values.flightNumber.trim().length === 0) {
    errors.flightNumber = 'Flight number is required.';
  }

  if (values.airline.trim().length === 0) {
    errors.airline = 'Airline is required.';
  }

  if (values.origin.trim().length === 0) {
    errors.origin = 'Origin is required.';
  }

  if (values.destination.trim().length === 0) {
    errors.destination = 'Destination is required.';
  } else if (
    values.origin.trim().length > 0 &&
    values.destination.trim().toLowerCase() ===
      values.origin.trim().toLowerCase()
  ) {
    errors.destination = 'Destination must differ from origin.';
  }

  if (values.departureTime.length === 0) {
    errors.departureTime = 'Departure time is required.';
  } else if (Number.isNaN(departure.getTime())) {
    errors.departureTime = 'Departure time must be a valid date and time.';
  }

  if (values.arrivalTime.length === 0) {
    errors.arrivalTime = 'Arrival time is required.';
  } else if (Number.isNaN(arrival.getTime())) {
    errors.arrivalTime = 'Arrival time must be a valid date and time.';
  } else if (!Number.isNaN(departure.getTime()) && arrival <= departure) {
    errors.arrivalTime = 'Arrival must be after departure.';
  }

  if (values.price.trim().length === 0) {
    errors.price = 'Price is required.';
  } else if (!Number.isFinite(price) || price < 0) {
    errors.price = 'Price cannot be negative.';
  }

  if (values.seatsAvailable.trim().length === 0) {
    errors.seatsAvailable = 'Seat count is required.';
  } else if (!Number.isInteger(seats)) {
    errors.seatsAvailable = 'Seat count must be a whole number.';
  } else if (seats < 0) {
    errors.seatsAvailable = 'Seat count cannot be negative.';
  }

  if (!FLIGHT_STATUSES.includes(values.status)) {
    errors.status = 'Please choose a valid status.';
  }

  return errors;
}
