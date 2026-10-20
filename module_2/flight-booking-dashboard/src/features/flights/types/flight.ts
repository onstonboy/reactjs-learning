export type FlightStatus = 'Scheduled' | 'Boarding' | 'Delayed' | 'Cancelled';

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seatsAvailable: number;
  status: FlightStatus;
}

export interface Booking {
  id: string;
  flightId: string;
  flightNumber: string;
  route: string;
  passengerName: string;
  email: string;
  seats: number;
  totalPrice: number;
  bookedAt: string;
}

export interface CreateBookingInput {
  flightId: string;
  passengerName: string;
  email: string;
  seats: number;
}

export interface BookingFormValues {
  flightId: string;
  passengerName: string;
  email: string;
  seats: string;
}

export type BookingFormErrors = Partial<
  Record<keyof BookingFormValues, string>
>;

export interface CreateFlightInput {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seatsAvailable: number;
  status: FlightStatus;
}

export interface FlightFormValues {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  seatsAvailable: string;
  status: FlightStatus;
}

export type FlightFormErrors = Partial<Record<keyof FlightFormValues, string>>;
