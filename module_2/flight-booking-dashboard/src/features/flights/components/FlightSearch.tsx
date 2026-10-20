interface FlightSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function FlightSearch({ value, onChange }: FlightSearchProps) {
  return (
    <div className="control control--search">
      <label className="control__label" htmlFor="flight-search">
        Search
      </label>
      <input
        id="flight-search"
        className="control__input"
        type="search"
        placeholder="Search by flight number, airline or route"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
