interface CourseSummaryProps {
  totalCourses: number;
  totalLearners: number;
}

export function CourseSummary({
  totalCourses,
  totalLearners,
}: CourseSummaryProps) {
  return (
    <div className="summary" aria-label="Course summary">
      <div className="summary__item">
        <span className="summary__value">{totalCourses}</span>
        <span className="summary__label">
          {totalCourses === 1 ? 'course' : 'courses'}
        </span>
      </div>
      <div className="summary__item">
        <span className="summary__value">
          {new Intl.NumberFormat('en-US').format(totalLearners)}
        </span>
        <span className="summary__label">learners</span>
      </div>
    </div>
  );
}
