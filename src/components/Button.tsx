import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-jakarta font-semibold transition-all duration-200 active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-primary text-on-primary shadow-[0_2px_0_rgb(55,48,163,0.3)] hover:shadow-none hover:bg-primary-container',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container',
    outline: 'border border-outline-variant bg-surface hover:bg-surface-container text-on-surface',
    ghost: 'hover:bg-surface-container text-primary'
  }

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'py-[12px] px-4 text-base',
    lg: 'py-[14px] px-6 text-lg'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
