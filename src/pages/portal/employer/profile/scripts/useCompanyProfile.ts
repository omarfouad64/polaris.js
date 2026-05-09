import { useState, useEffect } from 'react'
import type { CompanyProfile } from '../../../../../types'

const defaultProfile: CompanyProfile = {
  companyName: 'TechVentures Inc.',
  biography: 'TechVentures is a leading technology company specializing in cloud solutions and AI-driven platforms. Founded in 2015, we have grown to serve over 200 enterprise clients worldwide.',
  address: '5th Settlement, New Cairo, Egypt',
  contactEmail: 'employer@company.com',
  phone: '+20 123 456 7890',
  logoUrl: '',
  approvalStatus: 'Approved',
  location: { lat: 30.0131, lng: 31.4089 },
  locationAddress: '5th Settlement, New Cairo, Egypt',
  documents: [
    { id: 'doc-1', name: 'tax_certificate_2024.pdf', type: 'application/pdf', size: 245760, uploadedAt: '2024-06-15' },
    { id: 'doc-2', name: 'commercial_register.pdf', type: 'application/pdf', size: 312000, uploadedAt: '2024-06-15' }
  ]
}

const STORAGE_KEY = 'polaris_company_profile'
const PROFILE_UPDATED_EVENT = 'polaris_company_profile_updated'

/**
 * useCompanyProfile — provides company profile data and CRUD operations.
 *
 * @returns profile data, update function, document management functions.
 */
export default function useCompanyProfile(): {
  profile: CompanyProfile
  updateProfile: (updates: Partial<CompanyProfile>) => void
  setLocation: (lat: number, lng: number, address?: string | null) => void
  uploadDocument: (file: File) => void
  removeDocument: (docId: string) => void
} {
  const [profile, setProfile] = useState<CompanyProfile>(() => {
    if (typeof window === 'undefined') return defaultProfile
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultProfile
    try {
      return JSON.parse(saved)
    } catch {
      return defaultProfile
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    }
  }, [profile])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleProfileSync = () => {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (!saved) return
      try {
        setProfile(JSON.parse(saved) as CompanyProfile)
      } catch {
        // Ignore malformed storage payloads.
      }
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileSync)
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileSync)
  }, [])

  const updateProfile = (updates: Partial<CompanyProfile>): void => {
    setProfile(prev => {
      const next = { ...prev, ...updates }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
      }
      return next
    })
  }

  const setLocation = (lat: number, lng: number, address?: string | null): void => {
    setProfile(prev => {
      const next = {
        ...prev,
        location: { lat, lng },
        locationAddress: address ?? null,
        address: address ?? prev.address
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
      }
      return next
    })
  }

  const uploadDocument = (file: File): void => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type || 'application/pdf',
      size: file.size,
      uploadedAt: new Date().toISOString().split('T')[0]
    }
    setProfile(prev => {
      const next = { ...prev, documents: [...prev.documents, newDoc] }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
      }
      return next
    })
  }

  const removeDocument = (docId: string): void => {
    setProfile(prev => {
      const next = {
        ...prev,
        documents: prev.documents.filter(d => d.id !== docId)
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
      }
      return next
    })
  }

  return { profile, updateProfile, setLocation, uploadDocument, removeDocument }
}
