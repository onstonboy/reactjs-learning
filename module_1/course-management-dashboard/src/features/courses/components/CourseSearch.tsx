interface CourseSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CourseSearch({ value, onChange }: CourseSearchProps) {
  return (
    <div className="control control--search">
      <label className="control__label" htmlFor="course-search">
        Search
      </label>
      <input
        id="course-search"
        className="control__input"
        type="search"
        placeholder="Search by course name or instructor"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
