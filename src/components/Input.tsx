import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="font-jakarta text-label-md text-on-surface-variant px-1">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-outline-variant group-focus-within:text-primary transition-colors pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-surface rounded-lg border border-outline-variant py-[14px] font-lexend text-body-md text-on-surface placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors ${
            icon ? 'pl-[48px] pr-4' : 'px-4'
          } ${error ? 'border-error' : ''} ${className}`}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-bold text-error px-1">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
