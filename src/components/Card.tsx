import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export default function Card({ children, className = '', title, description }: CardProps) {
  return (
    <div className={`bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgb(55,48,163,0.06)] border border-surface-container p-lg lg:p-xl flex flex-col gap-lg ${className}`}>
      {(title || description) && (
        <div className="flex flex-col gap-xs text-center md:text-left">
          {title && <h2 className="font-jakarta text-h2 text-on-surface">{title}</h2>}
          {description && <p className="font-lexend text-body-md text-on-surface-variant">{description}</p>}
        </div>
      )}
      <div className="flex flex-col gap-md">{children}</div>
    </div>
  )
}
