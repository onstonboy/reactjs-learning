import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { FormField } from '../../../components/ui/FormField';
import type {
  BookingFormErrors,
  BookingFormValues,
  CreateBookingInput,
  Flight,
} from '../types/flight';
import { formatPrice } from '../utils/format';
import { validateBookingForm } from '../utils/validateBookingForm';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface BookingFormProps {
  bookableFlights: Flight[];
  initialFlightId: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (values: CreateBookingInput) => void;
  onCancel: () => void;
}

export function BookingForm({
  bookableFlights,
  initialFlightId,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: BookingFormProps) {
  const [values, setValues] = useState<BookingFormValues>({
    flightId: initialFlightId ?? '',
    passengerName: '',
    email: '',
    seats: '1',
  });
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const dialogRef = useRef<HTMLDivElement>(null);

  const selectedFlight =
    bookableFlights.find((flight) => flight.id === values.flightId) ?? null;
  const maxSeats = selectedFlight ? selectedFlight.seatsAvailable : null;

  useEffect(() => {
    const dialog: HTMLDivElement | null = dialogRef.current;
    if (!dialog) return;

    const dialogElement: HTMLDivElement = dialog;
    const firstField = dialog.querySelector<HTMLElement>(
      'input, select, textarea',
    );
    firstField?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        dialogElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute('disabled'));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  function updateField(field: keyof BookingFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateBookingForm(values, maxSeats);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      flightId: values.flightId,
      passengerName: values.passengerName.trim(),
      email: values.email.trim(),
      seats: Number(values.seats),
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-form-title"
        ref={dialogRef}
      >
        <div className="modal__header">
          <h2 className="modal__title" id="booking-form-title">
            Book a flight
          </h2>
        </div>
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          {submitError ? (
            <p className="form-error-banner" role="alert">
              {submitError}
            </p>
          ) : null}

          <FormField id="booking-flight" label="Flight" error={errors.flightId}>
            <select
              id="booking-flight"
              className="form-field__select"
              value={values.flightId}
              onChange={(event) => updateField('flightId', event.target.value)}
              aria-invalid={Boolean(errors.flightId)}
              aria-describedby={
                errors.flightId ? 'booking-flight-error' : undefined
              }
            >
              <option value="">Select a flight</option>
              {bookableFlights.map((flight) => (
                <option key={flight.id} value={flight.id}>
                  {flight.flightNumber} · {flight.origin} → {flight.destination}{' '}
                  · {formatPrice(flight.price)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="booking-passenger"
            label="Passenger name"
            error={errors.passengerName}
          >
            <input
              id="booking-passenger"
              className="form-field__input"
              type="text"
              value={values.passengerName}
              onChange={(event) =>
                updateField('passengerName', event.target.value)
              }
              aria-invalid={Boolean(errors.passengerName)}
              aria-describedby={
                errors.passengerName ? 'booking-passenger-error' : undefined
              }
            />
          </FormField>

          <FormField id="booking-email" label="Email" error={errors.email}>
            <input
              id="booking-email"
              className="form-field__input"
              type="email"
              value={values.email}
              onChange={(event) => updateField('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? 'booking-email-error' : undefined
              }
            />
          </FormField>

          <FormField
            id="booking-seats"
            label={`Seats${maxSeats !== null ? ` (max ${Math.min(maxSeats, 10)})` : ''}`}
            error={errors.seats}
          >
            <input
              id="booking-seats"
              className="form-field__input"
              type="number"
              min={1}
              max={maxSeats !== null ? Math.min(maxSeats, 10) : 10}
              inputMode="numeric"
              value={values.seats}
              onChange={(event) => updateField('seats', event.target.value)}
              aria-invalid={Boolean(errors.seats)}
              aria-describedby={
                errors.seats ? 'booking-seats-error' : undefined
              }
            />
          </FormField>

          {selectedFlight ? (
            <p className="form-field__label">
              Estimated total:{' '}
              {formatPrice(selectedFlight.price * (Number(values.seats) || 0))}
            </p>
          ) : null}

          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Booking…' : 'Confirm booking'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
