import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { FormField } from '../../../components/ui/FormField';
import { Modal } from '../../../components/ui/Modal';
import type {
  CreateFlightInput,
  FlightFormErrors,
  FlightFormValues,
  FlightStatus,
} from '../types/flight';
import { validateFlightForm } from '../utils/validateFlightForm';

const STATUS_OPTIONS: FlightStatus[] = [
  'Scheduled',
  'Boarding',
  'Delayed',
  'Cancelled',
];

const INITIAL_VALUES: FlightFormValues = {
  flightNumber: '',
  airline: '',
  origin: '',
  destination: '',
  departureTime: '',
  arrivalTime: '',
  price: '',
  seatsAvailable: '',
  status: 'Scheduled',
};

interface FlightFormProps {
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (values: CreateFlightInput) => void;
  onCancel: () => void;
}

export function FlightForm({
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: FlightFormProps) {
  const [values, setValues] = useState<FlightFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FlightFormErrors>({});

  function updateField(field: keyof FlightFormValues, value: string) {
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

    const nextErrors = validateFlightForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      flightNumber: values.flightNumber.trim(),
      airline: values.airline.trim(),
      origin: values.origin.trim(),
      destination: values.destination.trim(),
      departureTime: new Date(values.departureTime).toISOString(),
      arrivalTime: new Date(values.arrivalTime).toISOString(),
      price: Number(values.price),
      seatsAvailable: Number(values.seatsAvailable),
      status: values.status,
    });
    setValues(INITIAL_VALUES);
  }

  return (
    <Modal title="Add a flight" onClose={onCancel}>
      <form className="modal-form" onSubmit={handleSubmit} noValidate>
        {submitError ? (
          <p className="form-error-banner" role="alert">
            {submitError}
          </p>
        ) : null}

        <div className="form-grid">
          <FormField
            id="flight-number"
            label="Flight number"
            error={errors.flightNumber}
          >
            <input
              id="flight-number"
              className="form-field__input"
              type="text"
              placeholder="e.g. VN123"
              value={values.flightNumber}
              onChange={(event) =>
                updateField('flightNumber', event.target.value)
              }
              aria-invalid={Boolean(errors.flightNumber)}
              aria-describedby={
                errors.flightNumber ? 'flight-number-error' : undefined
              }
            />
          </FormField>

          <FormField id="flight-airline" label="Airline" error={errors.airline}>
            <input
              id="flight-airline"
              className="form-field__input"
              type="text"
              value={values.airline}
              onChange={(event) => updateField('airline', event.target.value)}
              aria-invalid={Boolean(errors.airline)}
              aria-describedby={
                errors.airline ? 'flight-airline-error' : undefined
              }
            />
          </FormField>

          <FormField id="flight-origin" label="Origin" error={errors.origin}>
            <input
              id="flight-origin"
              className="form-field__input"
              type="text"
              placeholder="e.g. HAN — Hanoi"
              value={values.origin}
              onChange={(event) => updateField('origin', event.target.value)}
              aria-invalid={Boolean(errors.origin)}
              aria-describedby={
                errors.origin ? 'flight-origin-error' : undefined
              }
            />
          </FormField>

          <FormField
            id="flight-destination"
            label="Destination"
            error={errors.destination}
          >
            <input
              id="flight-destination"
              className="form-field__input"
              type="text"
              placeholder="e.g. SGN — Ho Chi Minh City"
              value={values.destination}
              onChange={(event) =>
                updateField('destination', event.target.value)
              }
              aria-invalid={Boolean(errors.destination)}
              aria-describedby={
                errors.destination ? 'flight-destination-error' : undefined
              }
            />
          </FormField>

          <FormField
            id="flight-departure"
            label="Departure"
            error={errors.departureTime}
          >
            <input
              id="flight-departure"
              className="form-field__input"
              type="datetime-local"
              value={values.departureTime}
              onChange={(event) =>
                updateField('departureTime', event.target.value)
              }
              aria-invalid={Boolean(errors.departureTime)}
              aria-describedby={
                errors.departureTime ? 'flight-departure-error' : undefined
              }
            />
          </FormField>

          <FormField
            id="flight-arrival"
            label="Arrival"
            error={errors.arrivalTime}
          >
            <input
              id="flight-arrival"
              className="form-field__input"
              type="datetime-local"
              value={values.arrivalTime}
              onChange={(event) =>
                updateField('arrivalTime', event.target.value)
              }
              aria-invalid={Boolean(errors.arrivalTime)}
              aria-describedby={
                errors.arrivalTime ? 'flight-arrival-error' : undefined
              }
            />
          </FormField>

          <FormField id="flight-price" label="Price (USD)" error={errors.price}>
            <input
              id="flight-price"
              className="form-field__input"
              type="number"
              min={0}
              step="1"
              inputMode="decimal"
              value={values.price}
              onChange={(event) => updateField('price', event.target.value)}
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? 'flight-price-error' : undefined}
            />
          </FormField>

          <FormField
            id="flight-seats"
            label="Seats available"
            error={errors.seatsAvailable}
          >
            <input
              id="flight-seats"
              className="form-field__input"
              type="number"
              min={0}
              step="1"
              inputMode="numeric"
              value={values.seatsAvailable}
              onChange={(event) =>
                updateField('seatsAvailable', event.target.value)
              }
              aria-invalid={Boolean(errors.seatsAvailable)}
              aria-describedby={
                errors.seatsAvailable ? 'flight-seats-error' : undefined
              }
            />
          </FormField>

          <FormField id="flight-status" label="Status" error={errors.status}>
            <select
              id="flight-status"
              className="form-field__select"
              value={values.status}
              onChange={(event) => updateField('status', event.target.value)}
              aria-invalid={Boolean(errors.status)}
              aria-describedby={
                errors.status ? 'flight-status-error' : undefined
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="form-actions">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding…' : 'Add flight'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
