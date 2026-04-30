import { useState } from 'react'
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
  const [profile, setProfile] = useState<CompanyProfile>(defaultProfile)

  const updateProfile = (updates: Partial<CompanyProfile>): void => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const setLocation = (lat: number, lng: number, address?: string | null): void => {
    setProfile(prev => ({
      ...prev,
      location: { lat, lng },
      locationAddress: address ?? prev.locationAddress ?? null
    }))
  }

  const uploadDocument = (file: File): void => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type || 'application/pdf',
      size: file.size,
      uploadedAt: new Date().toISOString().split('T')[0]
    }
    setProfile(prev => ({ ...prev, documents: [...prev.documents, newDoc] }))
  }

  const removeDocument = (docId: string): void => {
    setProfile(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== docId)
    }))
  }

  return { profile, updateProfile, setLocation, uploadDocument, removeDocument }
}
