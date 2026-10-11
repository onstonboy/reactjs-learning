interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = 'Loading courses…',
}: LoadingStateProps) {
  return (
    <section className="state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state__message">{message}</p>
    </section>
  );
}
