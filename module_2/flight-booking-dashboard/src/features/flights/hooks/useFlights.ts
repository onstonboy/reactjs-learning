import { useCallback, useEffect, useState } from 'react';
import type { ApiState } from '../../../types/api';
import {
  createBooking,
  createFlight,
  getFlights,
  updateFlightStatus,
} from '../services/flightService';
import type {
  Booking,
  CreateBookingInput,
  CreateFlightInput,
  Flight,
  FlightStatus,
} from '../types/flight';
import { getErrorMessage } from '../utils/errors';

export function useFlights() {
  const [flightsState, setFlightsState] = useState<ApiState<Flight[]>>({
    status: 'loading',
  });
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadFlights = useCallback(async () => {
    setFlightsState({ status: 'loading' });

    try {
      const data = await getFlights();
      setFlightsState({ status: 'success', data });
    } catch (error: unknown) {
      console.error(error);
      setFlightsState({ status: 'error', message: getErrorMessage(error) });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getFlights()
      .then((data) => {
        if (cancelled) return;
        setFlightsState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error(error);
        setFlightsState({ status: 'error', message: getErrorMessage(error) });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const bookFlight = useCallback(
    async (input: CreateBookingInput): Promise<Booking> => {
      const booking = await createBooking(input);

      setFlightsState((previous) => {
        if (previous.status !== 'success') return previous;
        return {
          status: 'success',
          data: previous.data.map((flight) =>
            flight.id === booking.flightId
              ? {
                  ...flight,
                  seatsAvailable: flight.seatsAvailable - booking.seats,
                }
              : flight,
          ),
        };
      });
      setBookings((previous) => [booking, ...previous]);

      return booking;
    },
    [],
  );

  const addFlight = useCallback(
    async (input: CreateFlightInput): Promise<Flight> => {
      const flight = await createFlight(input);

      setFlightsState((previous) => {
        if (previous.status !== 'success') return previous;
        return { status: 'success', data: [flight, ...previous.data] };
      });

      return flight;
    },
    [],
  );

  const changeFlightStatus = useCallback(
    async (flightId: string, status: FlightStatus): Promise<Flight> => {
      const updated = await updateFlightStatus(flightId, status);

      setFlightsState((previous) => {
        if (previous.status !== 'success') return previous;
        return {
          status: 'success',
          data: previous.data.map((flight) =>
            flight.id === flightId
              ? { ...flight, status: updated.status }
              : flight,
          ),
        };
      });

      return updated;
    },
    [],
  );

  return {
    flightsState,
    bookings,
    loadFlights,
    bookFlight,
    addFlight,
    changeFlightStatus,
  };
}
