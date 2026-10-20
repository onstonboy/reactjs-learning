import { mockFlights } from '../data/mockFlights';
import type {
  Booking,
  CreateBookingInput,
  CreateFlightInput,
  Flight,
  FlightStatus,
} from '../types/flight';

const DEFAULT_DELAY_MS = 600;
const MAX_BOOKING_REF = 999_999;

let flightsStore: Flight[] = mockFlights.map((flight) => ({ ...flight }));
let bookingsStore: Booking[] = [];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function resolveDelay(): number {
  const parsed = Number(import.meta.env.VITE_MOCK_API_DELAY_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DELAY_MS;
}

function shouldFail(): boolean {
  return import.meta.env.VITE_MOCK_API_SHOULD_FAIL === 'true';
}

export async function getFlights(): Promise<Flight[]> {
  await delay(resolveDelay());

  if (shouldFail()) {
    throw new Error('Unable to load flights. Please try again.');
  }

  return flightsStore.map((flight) => ({ ...flight }));
}

export async function createFlight(input: CreateFlightInput): Promise<Flight> {
  await delay(resolveDelay());

  if (shouldFail()) {
    throw new Error('Unable to add the flight. Please try again.');
  }

  const flight: Flight = {
    id: `flight-${crypto.randomUUID()}`,
    flightNumber: input.flightNumber,
    airline: input.airline,
    origin: input.origin,
    destination: input.destination,
    departureTime: input.departureTime,
    arrivalTime: input.arrivalTime,
    price: input.price,
    seatsAvailable: input.seatsAvailable,
    status: input.status,
  };

  flightsStore = [flight, ...flightsStore];

  return { ...flight };
}

export async function updateFlightStatus(
  flightId: string,
  status: FlightStatus,
): Promise<Flight> {
  await delay(resolveDelay());

  if (shouldFail()) {
    throw new Error('Unable to update the flight status. Please try again.');
  }

  const flight = flightsStore.find((item) => item.id === flightId);
  if (!flight) {
    throw new Error('The selected flight could not be found.');
  }

  flightsStore = flightsStore.map((item) =>
    item.id === flightId ? { ...item, status } : item,
  );

  return { ...flight, status };
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<Booking> {
  await delay(resolveDelay());

  if (shouldFail()) {
    throw new Error('Unable to complete the booking. Please try again.');
  }

  const flight = flightsStore.find((item) => item.id === input.flightId);
  if (!flight) {
    throw new Error('The selected flight could not be found.');
  }
  if (flight.status === 'Cancelled') {
    throw new Error('This flight has been cancelled and cannot be booked.');
  }
  if (input.seats < 1 || input.seats > flight.seatsAvailable) {
    throw new Error(
      `Only ${flight.seatsAvailable} seat(s) remain on this flight.`,
    );
  }

  const booking: Booking = {
    id: `BK-${Math.floor(100000 + Math.random() * MAX_BOOKING_REF)}`,
    flightId: flight.id,
    flightNumber: flight.flightNumber,
    route: `${flight.origin} → ${flight.destination}`,
    passengerName: input.passengerName,
    email: input.email,
    seats: input.seats,
    totalPrice: flight.price * input.seats,
    bookedAt: new Date().toISOString(),
  };

  flightsStore = flightsStore.map((item) =>
    item.id === flight.id
      ? { ...item, seatsAvailable: item.seatsAvailable - input.seats }
      : item,
  );
  bookingsStore = [booking, ...bookingsStore];

  return { ...booking };
}
