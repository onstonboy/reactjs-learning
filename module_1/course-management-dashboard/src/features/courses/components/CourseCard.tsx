import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Course } from '../types/course';

interface CourseCardProps {
  course: Course;
}

function formatLearnerCount(count: number): string {
  return new Intl.NumberFormat('en-US').format(count);
}

function formatCreatedAt(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="course-card">
      <div className="course-card__header">
        <h3 className="course-card__title">{course.name}</h3>
        <StatusBadge status={course.status} />
      </div>
      <p className="course-card__instructor">by {course.instructor}</p>
      <p className="course-card__description">{course.description}</p>
      <div className="course-card__meta">
        <span className="course-card__meta-item">Level: {course.level}</span>
        <span className="course-card__meta-item">
          {formatLearnerCount(course.learnerCount)} learners
        </span>
        <span className="course-card__meta-item">
          Created {formatCreatedAt(course.createdAt)}
        </span>
      </div>
    </article>
  );
}
