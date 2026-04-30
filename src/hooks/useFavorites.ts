import { useState, useMemo } from 'react'
import type { FavoriteItem } from '../types'

const dummyFavorites: FavoriteItem[] = [
  { id: 'fav-1', type: 'project', title: 'AI-Powered Study Planner', subtitle: 'Computer Science • Ahmed Hassan', tags: ['Python', 'TensorFlow', 'React'], rating: 4.5, savedAt: '2026-04-10' },
  { id: 'fav-2', type: 'project', title: 'GUC Campus Navigator', subtitle: 'Software Engineering • Sara Mohamed', tags: ['Flutter', 'Firebase', 'Maps API'], rating: 4.8, savedAt: '2026-04-08' },
  { id: 'fav-3', type: 'project', title: 'E-Commerce Platform', subtitle: 'Web Development • Omar Khaled', tags: ['Next.js', 'Stripe', 'PostgreSQL'], rating: 4.2, savedAt: '2026-03-25' },
  { id: 'fav-4', type: 'portfolio', title: 'Ahmed Hassan', subtitle: 'Computer Science • 8 Projects', tags: ['Full-Stack', 'AI/ML', 'Cloud'], savedAt: '2026-04-12' },
  { id: 'fav-5', type: 'portfolio', title: 'Sara Mohamed', subtitle: 'Media Engineering • 5 Projects', tags: ['Mobile', 'UX Design', 'Flutter'], savedAt: '2026-04-05' },
  { id: 'fav-6', type: 'portfolio', title: 'Nour Ali', subtitle: 'Design • 6 Projects', tags: ['UI/UX', 'Figma', 'Research'], savedAt: '2026-03-30' }
]

const dummyRecommended: FavoriteItem[] = [
  { id: 'rec-1', type: 'project', title: 'Smart Library System', subtitle: 'Databases • Khaled Youssef', tags: ['Java', 'MySQL', 'Spring Boot'], rating: 4.7, savedAt: '' },
  { id: 'rec-2', type: 'project', title: 'Blockchain Voting App', subtitle: 'Distributed Systems • Layla Ahmed', tags: ['Solidity', 'React', 'Ethereum'], rating: 4.9, savedAt: '' },
  { id: 'rec-3', type: 'project', title: 'Healthcare Dashboard', subtitle: 'Data Science • Mostafa Ali', tags: ['Python', 'D3.js', 'Flask'], rating: 4.4, savedAt: '' }
]

/**
 * useFavorites — manages saved projects and portfolios, and provides recommended projects.
 *
 * @returns favorite items split by type, add/remove functions, and recommended list.
 */
export default function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(dummyFavorites)

  const favoriteProjects = useMemo(() =>
    favorites.filter(f => f.type === 'project'), [favorites]
  )

  const favoritePortfolios = useMemo(() =>
    favorites.filter(f => f.type === 'portfolio'), [favorites]
  )

  const addFavorite = (item: Omit<FavoriteItem, 'savedAt'>): void => {
    setFavorites(prev => [...prev, { ...item, savedAt: new Date().toISOString().split('T')[0] }])
  }

  const removeFavorite = (id: string): void => {
    setFavorites(prev => prev.filter(f => f.id !== id))
  }

  const isFavorite = (id: string): boolean => {
    return favorites.some(f => f.id === id)
  }

  return {
    favorites,
    favoriteProjects,
    favoritePortfolios,
    recommendedProjects: dummyRecommended,
    addFavorite,
    removeFavorite,
    isFavorite
  }
}
