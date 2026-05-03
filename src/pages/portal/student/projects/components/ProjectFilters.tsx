interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  visibilityFilter: 'all' | 'public' | 'private';
  onVisibilityChange: (filter: 'all' | 'public' | 'private') => void;
}

/**
 * ProjectFilters — Search bar and visibility toggle for the project list.
 *
 * @param searchQuery - Current text search query.
 * @param onSearchChange - Callback when search query changes.
 * @param visibilityFilter - Current visibility filter (all, public, private).
 * @param onVisibilityChange - Callback when visibility filter changes.
 */
export default function ProjectFilters({
  searchQuery,
  onSearchChange,
  visibilityFilter,
  onVisibilityChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      {/* Search Bar */}
      <div className="relative flex-1 lg:max-w-[50%] flex items-center bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 shadow-sm focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 transition-all duration-200">
        <span className="material-symbols-outlined text-on-surface-variant text-xl mr-3">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your projects..."
          className="flex-1 bg-transparent border-none outline-none text-base font-lexend text-on-surface placeholder:text-on-surface-variant/40"
        />
      </div>

      {/* Visibility Filter */}
      <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/60 p-1 rounded-xl shadow-sm self-start lg:self-center">
        {(['all', 'public', 'private'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onVisibilityChange(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all duration-200 capitalize ${visibilityFilter === filter
              ? 'bg-secondary text-on-secondary shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
