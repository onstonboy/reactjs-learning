import { useCallback, useState } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { LoadingState } from '../components/ui/LoadingState';
import { BookingForm } from '../features/flights/components/BookingForm';
import { BookingList } from '../features/flights/components/BookingList';
import { FlightDetails } from '../features/flights/components/FlightDetails';
import { FlightFilters } from '../features/flights/components/FlightFilters';
import { FlightForm } from '../features/flights/components/FlightForm';
import { FlightList } from '../features/flights/components/FlightList';
import { FlightSearch } from '../features/flights/components/FlightSearch';
import { FlightSummary } from '../features/flights/components/FlightSummary';
import { useFlights } from '../features/flights/hooks/useFlights';
import type {
  CreateBookingInput,
  CreateFlightInput,
  Flight,
  FlightStatus,
} from '../features/flights/types/flight';
import { getErrorMessage } from '../features/flights/utils/errors';
import type {
  PriceFilter,
  StatusFilter,
} from '../features/flights/utils/filterFlights';
import { filterFlights } from '../features/flights/utils/filterFlights';

export function FlightDashboardPage() {
  const {
    flightsState,
    bookings,
    loadFlights,
    bookFlight,
    addFlight,
    changeFlightStatus,
  } = useFlights();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('All');
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [initialFlightId, setInitialFlightId] = useState<string | null>(null);
  const [isFlightFormOpen, setIsFlightFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const flights = flightsState.status === 'success' ? flightsState.data : [];
  const filteredFlights = filterFlights(
    flights,
    searchQuery,
    statusFilter,
    priceFilter,
  );
  const selectedFlight =
    flights.find((flight) => flight.id === selectedFlightId) ?? null;
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

  const openBookingForm = useCallback((flight: Flight | null) => {
    setInitialFlightId(flight ? flight.id : null);
    setSubmitError(null);
    setIsBookingFormOpen(true);
  }, []);

  const closeBookingForm = useCallback(() => {
    setIsBookingFormOpen(false);
    setSubmitError(null);
  }, []);

  const handleCancelBookingForm = useCallback(() => {
    if (!isSubmitting) closeBookingForm();
  }, [isSubmitting, closeBookingForm]);

  const openFlightForm = useCallback(() => {
    setSubmitError(null);
    setIsFlightFormOpen(true);
  }, []);

  const closeFlightForm = useCallback(() => {
    setIsFlightFormOpen(false);
    setSubmitError(null);
  }, []);

  const handleCancelFlightForm = useCallback(() => {
    if (!isSubmitting) closeFlightForm();
  }, [isSubmitting, closeFlightForm]);

  const handleSelectFlight = useCallback((flight: Flight) => {
    setSelectedFlightId(flight.id);
  }, []);

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
      setIsBookingFormOpen(false);
      setNotice(
        `Booking ${booking.id} confirmed for ${booking.passengerName} on flight ${booking.flightNumber}.`,
      );
    } catch (error: unknown) {
      console.error(error);
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddFlight(values: CreateFlightInput) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const flight = await addFlight(values);
      setIsFlightFormOpen(false);
      setSelectedFlightId(flight.id);
      setNotice(`Flight ${flight.flightNumber} was added to the schedule.`);
    } catch (error: unknown) {
      console.error(error);
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateStatus(flightId: string, status: FlightStatus) {
    setIsUpdatingStatus(true);

    try {
      const updated = await changeFlightStatus(flightId, status);
      setNotice(
        `Flight ${updated.flightNumber} is now ${updated.status.toLowerCase()}.`,
      );
    } catch (error: unknown) {
      console.error(error);
      setNotice(getErrorMessage(error));
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <>
      <AppHeader
        onBookFlight={() => openBookingForm(null)}
        onAddFlight={openFlightForm}
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

        {flightsState.status === 'idle' || flightsState.status === 'loading' ? (
          <LoadingState />
        ) : flightsState.status === 'error' ? (
          <ErrorState message={flightsState.message} onRetry={loadFlights} />
        ) : flights.length === 0 ? (
          <EmptyState
            title="No flights available"
            message="There are no flights in the schedule right now. Please check back later."
          />
        ) : (
          <div className="dashboard__content">
            <div className="dashboard__list">
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

              {filteredFlights.length === 0 ? (
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
                  selectedFlightId={selectedFlightId}
                  onSelect={handleSelectFlight}
                  onBook={(flight) => openBookingForm(flight)}
                />
              )}
            </div>

            <aside
              className="dashboard__details"
              aria-label="Selected flight details"
            >
              {selectedFlight ? (
                <FlightDetails
                  flight={selectedFlight}
                  isUpdatingStatus={isUpdatingStatus}
                  onUpdateStatus={handleUpdateStatus}
                  onBook={(flight) => openBookingForm(flight)}
                  onClose={() => setSelectedFlightId(null)}
                />
              ) : (
                <EmptyState
                  title="No flight selected"
                  message="Choose a flight from the list to see its full details."
                />
              )}
            </aside>
          </div>
        )}

        {bookings.length > 0 ? <BookingList bookings={bookings} /> : null}
      </main>

      <footer className="app-footer">
        <p>Flight Booking Dashboard — React module 2 project</p>
      </footer>

      {isBookingFormOpen ? (
        <BookingForm
          bookableFlights={bookableFlights}
          initialFlightId={initialFlightId}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleBookFlight}
          onCancel={handleCancelBookingForm}
        />
      ) : null}

      {isFlightFormOpen ? (
        <FlightForm
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleAddFlight}
          onCancel={handleCancelFlightForm}
        />
      ) : null}
    </>
  );
}
