import type { PriceFilter, StatusFilter } from '../utils/filterFlights';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'All', label: 'All statuses' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Boarding', label: 'Boarding' },
  { value: 'Delayed', label: 'Delayed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: 'All', label: 'All prices' },
  { value: 'under-100', label: 'Under $100' },
  { value: '100-300', label: '$100 – $300' },
  { value: 'over-300', label: 'Over $300' },
];

interface FlightFiltersProps {
  status: StatusFilter;
  price: PriceFilter;
  onStatusChange: (status: StatusFilter) => void;
  onPriceChange: (price: PriceFilter) => void;
}

export function FlightFilters({
  status,
  price,
  onStatusChange,
  onPriceChange,
}: FlightFiltersProps) {
  return (
    <>
      <div className="control control--select">
        <label className="control__label" htmlFor="status-filter">
          Status
        </label>
        <select
          id="status-filter"
          className="control__select"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as StatusFilter)
          }
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="control control--select">
        <label className="control__label" htmlFor="price-filter">
          Price
        </label>
        <select
          id="price-filter"
          className="control__select"
          value={price}
          onChange={(event) => onPriceChange(event.target.value as PriceFilter)}
        >
          {PRICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
