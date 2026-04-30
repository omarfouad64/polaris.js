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
  documents: [
    { id: 'doc-1', name: 'tax_certificate_2024.pdf', type: 'application/pdf', uploadedAt: '2024-06-15' },
    { id: 'doc-2', name: 'commercial_register.pdf', type: 'application/pdf', uploadedAt: '2024-06-15' }
  ]
}

/**
 * useCompanyProfile — provides company profile data and CRUD operations.
 *
 * @returns profile data, update function, document management functions.
 */
export default function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile>(defaultProfile)

  const updateProfile = (updates: Partial<CompanyProfile>): void => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const setLocation = (lat: number, lng: number): void => {
    setProfile(prev => ({ ...prev, location: { lat, lng } }))
  }

  const uploadDocument = (name: string): void => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name,
      type: 'application/pdf',
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
