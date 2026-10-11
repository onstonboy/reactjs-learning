import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="state state--error" role="alert">
      <h2 className="state__title">Could not load courses</h2>
      <p className="state__message">{message}</p>
      <div className="state__actions">
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </section>
  );
}
