import { useCallback, useRef, useState } from 'react';
import { AppHeader } from '../../../components/layout/AppHeader';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { useFlights } from '../hooks/useFlights';
import type { CreateBookingInput, Flight } from '../types/flight';
import { getErrorMessage } from '../utils/errors';
import type { PriceFilter, StatusFilter } from '../utils/filterFlights';
import { filterFlights } from '../utils/filterFlights';
import { BookingForm } from './BookingForm';
import { BookingList } from './BookingList';
import { FlightFilters } from './FlightFilters';
import { FlightList } from './FlightList';
import { FlightSearch } from './FlightSearch';
import { FlightSummary } from './FlightSummary';

export function FlightDashboard() {
  const { flightsState, bookings, loadFlights, bookFlight } = useFlights();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialFlightId, setInitialFlightId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const bookButtonRef = useRef<HTMLButtonElement>(null);

  const flights = flightsState.status === 'success' ? flightsState.data : [];
  const filteredFlights = filterFlights(
    flights,
    searchQuery,
    statusFilter,
    priceFilter,
  );
  const bookableFlights = flights.filter(
    (flight) => flight.status !== 'Cancelled' && flight.seatsAvailable > 0,
  );
  const totalSeats = flights.reduce(
    (sum, flight) => sum + flight.seatsAvailable,
    0,
  );
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'All' ||
    priceFilter !== 'All';

  const openForm = useCallback((flight: Flight | null) => {
    setInitialFlightId(flight ? flight.id : null);
    setSubmitError(null);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setSubmitError(null);
    bookButtonRef.current?.focus();
  }, []);

  const handleCancelForm = useCallback(() => {
    if (!isSubmitting) closeForm();
  }, [isSubmitting, closeForm]);

  function clearFilters() {
    setSearchQuery('');
    setStatusFilter('All');
    setPriceFilter('All');
  }

  async function handleBookFlight(values: CreateBookingInput) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const booking = await bookFlight(values);
      setIsFormOpen(false);
      setNotice(
        `Booking ${booking.id} confirmed for ${booking.passengerName} on flight ${booking.flightNumber}.`,
      );
      bookButtonRef.current?.focus();
    } catch (error: unknown) {
      console.error(error);
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader
        onBookFlight={() => openForm(null)}
        bookButtonRef={bookButtonRef}
      />

      <main className="dashboard">
        <section className="dashboard__intro">
          <div>
            <h1>Flight search</h1>
            <p>
              Search flights by route or airline, filter by status and price,
              then book your seat.
            </p>
          </div>
          {flightsState.status === 'success' ? (
            <FlightSummary
              totalFlights={flights.length}
              totalSeats={totalSeats}
              totalBookings={bookings.length}
            />
          ) : null}
        </section>

        <section className="toolbar" aria-label="Flight search and filters">
          <FlightSearch value={searchQuery} onChange={setSearchQuery} />
          <FlightFilters
            status={statusFilter}
            price={priceFilter}
            onStatusChange={setStatusFilter}
            onPriceChange={setPriceFilter}
          />
        </section>

        {notice ? (
          <div className="notice" role="status">
            <p>{notice}</p>
            <Button variant="ghost" onClick={() => setNotice(null)}>
              Dismiss
            </Button>
          </div>
        ) : null}

        {flightsState.status === 'success' && flights.length > 0 ? (
          <div className="results-bar">
            <p className="results-bar__count" aria-live="polite">
              {filteredFlights.length}{' '}
              {filteredFlights.length === 1 ? 'flight' : 'flights'}
              {hasActiveFilters ? ' matching filters' : ''}
            </p>
            {hasActiveFilters ? (
              <Button variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>
        ) : null}

        {flightsState.status === 'idle' || flightsState.status === 'loading' ? (
          <LoadingState />
        ) : flightsState.status === 'error' ? (
          <ErrorState message={flightsState.message} onRetry={loadFlights} />
        ) : flights.length === 0 ? (
          <EmptyState
            title="No flights available"
            message="There are no flights in the schedule right now. Please check back later."
          />
        ) : filteredFlights.length === 0 ? (
          <EmptyState
            title="No matching flights"
            message="Try adjusting your search terms or clearing the filters."
          >
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          </EmptyState>
        ) : (
          <FlightList
            flights={filteredFlights}
            onBook={(flight) => openForm(flight)}
          />
        )}

        {bookings.length > 0 ? <BookingList bookings={bookings} /> : null}
      </main>

      <footer className="app-footer">
        <p>Flight Booking Dashboard — React module 2 project</p>
      </footer>

      {isFormOpen ? (
        <BookingForm
          bookableFlights={bookableFlights}
          initialFlightId={initialFlightId}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleBookFlight}
          onCancel={handleCancelForm}
        />
      ) : null}
    </>
  );
}
