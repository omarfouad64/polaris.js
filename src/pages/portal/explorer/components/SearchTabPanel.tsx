import type { ReactNode } from 'react'

interface SearchTabPanelProps {
  title: string
  description: string
  children: ReactNode
}

/**
 * SearchTabPanel — shared layout for search tab content blocks.
 *
 * @param title - Title shown above the tab content.
 * @param description - Helper text describing the search section.
 * @param children - Tab content.
 */
export default function SearchTabPanel({
  title,
  description,
  children
}: SearchTabPanelProps): React.JSX.Element {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-jakarta font-bold text-on-surface">{title}</h2>
        <p className="text-sm font-lexend text-on-surface-variant">{description}</p>
      </div>
      {children}
    </section>
  )
}
