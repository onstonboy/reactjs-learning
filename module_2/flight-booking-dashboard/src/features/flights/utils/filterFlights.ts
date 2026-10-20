import type { Flight, FlightStatus } from '../types/flight';

export type StatusFilter = FlightStatus | 'All';
export type PriceFilter = 'All' | 'under-100' | '100-300' | 'over-300';

export function filterFlights(
  flights: Flight[],
  searchQuery: string,
  status: StatusFilter,
  price: PriceFilter,
): Flight[] {
  const query = searchQuery.trim().toLowerCase();

  return flights.filter((flight) => {
    const matchesQuery =
      query.length === 0 ||
      flight.flightNumber.toLowerCase().includes(query) ||
      flight.airline.toLowerCase().includes(query) ||
      flight.origin.toLowerCase().includes(query) ||
      flight.destination.toLowerCase().includes(query);
    const matchesStatus = status === 'All' || flight.status === status;
    const matchesPrice =
      price === 'All' ||
      (price === 'under-100' && flight.price < 100) ||
      (price === '100-300' && flight.price >= 100 && flight.price <= 300) ||
      (price === 'over-300' && flight.price > 300);

    return matchesQuery && matchesStatus && matchesPrice;
  });
}
