import type { FlightStatus } from '../../features/flights/types/flight';

const STATUS_STYLES: Record<FlightStatus, string> = {
  Scheduled: 'badge--scheduled',
  Boarding: 'badge--boarding',
  Delayed: 'badge--delayed',
  Cancelled: 'badge--cancelled',
};

interface StatusBadgeProps {
  status: FlightStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge ${STATUS_STYLES[status]}`}>{status}</span>;
}
