import type { CourseStatus } from '../../features/courses/types/course';

const STATUS_STYLES: Record<CourseStatus, string> = {
  Active: 'badge--active',
  Draft: 'badge--draft',
  Archived: 'badge--archived',
};

interface StatusBadgeProps {
  status: CourseStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge ${STATUS_STYLES[status]}`}>{status}</span>;
}
