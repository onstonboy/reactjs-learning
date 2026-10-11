import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  type = 'button',
  className,
  children,
  ref,
  ...rest
}: ButtonProps) {
  const classes = `btn btn--${variant}${className ? ` ${className}` : ''}`;

  return (
    <button type={type} className={classes} ref={ref} {...rest}>
      {children}
    </button>
  );
}
