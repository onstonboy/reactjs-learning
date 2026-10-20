import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="form-field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
