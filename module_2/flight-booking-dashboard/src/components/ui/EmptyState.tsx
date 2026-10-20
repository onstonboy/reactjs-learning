import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  children?: ReactNode;
}

export function EmptyState({ title, message, children }: EmptyStateProps) {
  return (
    <section className="state" aria-label={title}>
      <h2 className="state__title">{title}</h2>
      <p className="state__message">{message}</p>
      {children ? <div className="state__actions">{children}</div> : null}
    </section>
  );
}
