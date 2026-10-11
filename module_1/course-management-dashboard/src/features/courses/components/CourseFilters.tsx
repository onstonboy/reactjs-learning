import type { LevelFilter, StatusFilter } from '../utils/filterCourses';

const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: 'All', label: 'All levels' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'All', label: 'All statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Archived', label: 'Archived' },
];

interface CourseFiltersProps {
  level: LevelFilter;
  status: StatusFilter;
  onLevelChange: (level: LevelFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
}

export function CourseFilters({
  level,
  status,
  onLevelChange,
  onStatusChange,
}: CourseFiltersProps) {
  return (
    <>
      <div className="control control--select">
        <label className="control__label" htmlFor="level-filter">
          Level
        </label>
        <select
          id="level-filter"
          className="control__select"
          value={level}
          onChange={(event) => onLevelChange(event.target.value as LevelFilter)}
        >
          {LEVEL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
    </>
  );
}
