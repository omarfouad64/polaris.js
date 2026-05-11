import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGlobalContext } from '../../../../../globalContext'
import type { CompanyProfile } from '../../../../../types'
import type { RootState } from '../../../../../store'
import {
  updateCompanyProfile,
  setLocation,
  uploadDocument,
  removeDocument
} from '../../../../../store/databaseSlice'

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
 * useCompanyProfile — provides company profile data from Redux store.
 */
function useCompanyProfileImpl(): {
  profile: CompanyProfile
  updateProfile: (updates: Partial<CompanyProfile>) => void
  setLocation: (lat: number, lng: number, address?: string | null) => void
  uploadDocument: (file: File) => void
  removeDocument: (docId: string) => void
} {
  const { user } = useGlobalContext()
  const dispatch = useDispatch()
  const companies = useSelector((state: RootState) => state.database.companies)
  const [profile, setProfile] = useState<CompanyProfile>(defaultProfile)

  useEffect(() => {
    const myEmail = user?.username || ''
    const found = (companies || []).find((c: CompanyProfile) => c.contactEmail === myEmail)
    if (found) {
      setProfile(found)
    } else if (myEmail) {
      setProfile({
        ...defaultProfile,
        companyName: '',
        contactEmail: myEmail,
        biography: '',
        address: '',
        phone: '',
        logoUrl: '',
      })
    }
  }, [companies, user])

  const updateProfile = useCallback((updates: Partial<CompanyProfile>): void => {
    const myEmail = user?.username || profile.contactEmail || 'employer@company.com'
    setProfile(prev => {
      const next = { ...prev, ...updates }
      return next
    })
    dispatch(updateCompanyProfile({ contactEmail: myEmail, ...updates }))
  }, [dispatch, user?.username, profile.contactEmail])

  const setLocationAction = useCallback((lat: number, lng: number, address?: string | null): void => {
    const myEmail = user?.username || profile.contactEmail || 'employer@company.com'
    setProfile(prev => {
      const next = {
        ...prev,
        location: { lat, lng },
        locationAddress: address ?? null,
        address: address ?? prev.address
      }
      return next
    })
    dispatch(setLocation({ contactEmail: myEmail, lat, lng, address: address ?? null }))
  }, [dispatch, user?.username, profile.contactEmail])

  const uploadDocumentAction = useCallback((file: File): void => {
    const myEmail = user?.username || profile.contactEmail || 'employer@company.com'
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type || 'application/pdf',
      size: file.size,
      uploadedAt: new Date().toISOString().split('T')[0]
    }
    setProfile(prev => {
      const next = { ...prev, documents: [...prev.documents, newDoc] }
      return next
    })
    dispatch(uploadDocument({ contactEmail: myEmail, doc: newDoc }))
  }, [dispatch, user?.username, profile.contactEmail])

  const removeDocumentAction = useCallback((docId: string): void => {
    const myEmail = user?.username || profile.contactEmail || 'employer@company.com'
    setProfile(prev => {
      const next = {
        ...prev,
        documents: prev.documents.filter(d => d.id !== docId)
      }
      return next
    })
    dispatch(removeDocument({ contactEmail: myEmail, docId }))
  }, [dispatch, user?.username, profile.contactEmail])

 return { profile, updateProfile, setLocation: setLocationAction, uploadDocument: uploadDocumentAction, removeDocument: removeDocumentAction }
}

export default useCompanyProfileImpl
