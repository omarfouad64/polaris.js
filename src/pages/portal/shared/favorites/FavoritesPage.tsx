import { useState } from 'react'
import useFavorites from '../../../../hooks/useFavorites'
import type { FavoriteItem } from '../../../../types'

/**
 * FavoritesPage — displays saved projects and portfolios with remove functionality and recommended projects.
 *
 * Covers Req 65 (save/remove favorites), 66 (view favorites), 67 (recommended projects).
 * Shared between Student and Employer via routing.
 */
export default function FavoritesPage(): React.JSX.Element {
  const { favoriteProjects, favoritePortfolios, recommendedProjects, removeFavorite } = useFavorites()
  const [activeTab, setActiveTab] = useState<'projects' | 'portfolios' | 'recommended'>('projects')

  const renderProjectCard = (item: FavoriteItem, showRemove: boolean): React.JSX.Element => (
    <div key={item.id} className="group bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(55,48,163,0.10)] hover:scale-[1.01] relative" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
      {showRemove && (
        <button
          onClick={() => removeFavorite(item.id)}
          className="absolute top-3 right-3 p-1.5 rounded-full text-error hover:bg-error/10 hover:scale-110 transition-all focus-visible:ring-2 focus-visible:ring-secondary active:scale-90"
          aria-label={`Remove ${item.title} from favorites`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </button>
      )}
      <h4 className="font-jakarta font-semibold text-on-surface pr-8">{item.title}</h4>
      <p className="text-sm font-lexend text-on-surface-variant mt-1">{item.subtitle}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {item.tags.map(tag => (
          <span key={tag} className="px-2.5 py-0.5 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-lexend">{tag}</span>
        ))}
      </div>
      {item.rating && (
        <div className="flex items-center gap-1 mt-3">
          <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="text-sm font-jakarta font-semibold text-on-surface">{item.rating}</span>
        </div>
      )}
    </div>
  )

  const renderPortfolioCard = (item: FavoriteItem): React.JSX.Element => (
    <div key={item.id} className="group bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(55,48,163,0.10)] hover:scale-[1.01] relative cursor-pointer" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
      <button
        onClick={() => removeFavorite(item.id)}
        className="absolute top-3 right-3 p-1.5 rounded-full text-error hover:bg-error/10 hover:scale-110 transition-all focus-visible:ring-2 focus-visible:ring-secondary active:scale-90"
        aria-label={`Remove ${item.title} from favorites`}
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
      </button>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold">
          {item.title.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <h4 className="font-jakarta font-semibold text-on-surface">{item.title}</h4>
          <p className="text-sm font-lexend text-on-surface-variant">{item.subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {item.tags.map(tag => (
          <span key={tag} className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-jakarta font-semibold">{tag}</span>
        ))}
      </div>
    </div>
  )

  const renderEmpty = (type: string): React.JSX.Element => (
    <div className="col-span-full text-center py-16">
      <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-outline/40">favorite_border</span>
      </div>
      <h4 className="font-jakarta font-semibold text-on-surface">No favorite {type} yet.</h4>
      <p className="font-lexend text-on-surface-variant text-sm mt-1">Browse {type} and tap the ♥ to save them here.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-jakarta font-bold text-on-surface">My Favorites</h2>
        <p className="font-lexend text-on-surface-variant text-sm">Your saved projects and portfolios.</p>
      </div>

      <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab('projects')} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all ${activeTab === 'projects' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
          Projects ({favoriteProjects.length})
        </button>
        <button onClick={() => setActiveTab('portfolios')} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all ${activeTab === 'portfolios' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
          Portfolios ({favoritePortfolios.length})
        </button>
        <button onClick={() => setActiveTab('recommended')} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all ${activeTab === 'recommended' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
          Recommended
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'projects' && (
          favoriteProjects.length === 0
            ? renderEmpty('projects')
            : favoriteProjects.map(item => renderProjectCard(item, true))
        )}
        {activeTab === 'portfolios' && (
          favoritePortfolios.length === 0
            ? renderEmpty('portfolios')
            : favoritePortfolios.map(renderPortfolioCard)
        )}
        {activeTab === 'recommended' && (
          recommendedProjects.length === 0
            ? renderEmpty('recommendations')
            : recommendedProjects.map(item => renderProjectCard(item, false))
        )}
      </div>
    </div>
  )
}
