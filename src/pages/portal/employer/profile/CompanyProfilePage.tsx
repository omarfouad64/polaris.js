import { useRef, useState, useEffect } from 'react'
import useCompanyProfile from './scripts/useCompanyProfile'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import OsmMapPicker from './components/OsmMapPicker'
import FeedbackDialog from '../../../../components/FeedbackDialog'
import { useGlobalContext } from '../../../../globalContext'

/**
 * CompanyProfilePage — employer company profile management with Details and Location tabs.
 *
 * Covers Req 10 (company info CRUD), Req 11 (Google Maps location), Req 13 (PDF document upload).
 */
export default function CompanyProfilePage(): React.JSX.Element {
  const { profile, updateProfile, setLocation, uploadDocument, removeDocument } = useCompanyProfile()
  const { updateUser, user } = useGlobalContext()
  const [activeTab, setActiveTab] = useState<'details' | 'location' | 'documents'>('details')
  const [isEditing, setIsEditing] = useState(false)
  const [pendingLocation, setPendingLocation] = useState(profile.location)
  const [pendingAddress, setPendingAddress] = useState<string | null>(profile.locationAddress ?? null)
  const [addressStatus, setAddressStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [documentError, setDocumentError] = useState('')
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [form, setForm] = useState({
    biography: profile.biography,
    address: profile.address,
    contactEmail: profile.contactEmail,
    phone: profile.phone
  })
  const documentInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const reverseGeocodeRequestId = useRef(0)
  const maxPdfSize = 5 * 1024 * 1024

  // Sync initial user data if available
  useEffect(() => {
    if (user && !profile.logoUrl && user.profilePicture) {
       updateProfile({ logoUrl: user.profilePicture })
    }
  }, [])

  const handleSave = (): void => {
    updateProfile(form)
    setIsEditing(false)
    setSuccessMessage('Company profile details updated successfully.')
    setShowSuccessDialog(true)
  }

  const handleCancel = (): void => {
    setForm({
      biography: profile.biography,
      address: profile.address,
      contactEmail: profile.contactEmail,
      phone: profile.phone
    })
    setIsEditing(false)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const pictureUrl = e.target?.result as string
        updateProfile({ logoUrl: pictureUrl })
        updateUser({ profilePicture: pictureUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          signal: controller.signal,
          headers: { Accept: 'application/json', 'Accept-Language': 'en' }
        }
      )
      if (!response.ok) {
        return null
      }
      const data = (await response.json()) as { display_name?: string }
      return data.display_name ?? null
    } catch {
      return null
    } finally {
      window.clearTimeout(timeoutId)
    }
  }

  const handleLocationChange = async (location: { lat: number; lng: number }): Promise<void> => {
    setPendingLocation(location)
    setPendingAddress(null)
    setAddressStatus('loading')
    const requestId = (reverseGeocodeRequestId.current += 1)
    const address = await reverseGeocode(location.lat, location.lng)

    if (requestId !== reverseGeocodeRequestId.current) return

    if (address) {
      setPendingAddress(address)
      setAddressStatus('idle')
    } else {
      setPendingAddress(null)
      setAddressStatus('error')
    }
  }

  const handleSaveLocation = (): void => {
    if (!pendingLocation) return
    
    // Update the profile state
    setLocation(pendingLocation.lat, pendingLocation.lng, pendingAddress ?? null)
    
    // Clear pending state to reflect the new saved state in the UI
    setPendingLocation(null)
    setPendingAddress(null)
    setAddressStatus('idle')
    
    setSuccessMessage('Company location has been updated successfully.')
    setShowSuccessDialog(true)
  }

  const handleDocumentUpload = (file: File): void => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setDocumentError('Please upload a PDF document.')
      return
    }
    if (file.size > maxPdfSize) {
      setDocumentError('PDF must be 5MB or smaller.')
      return
    }

    setDocumentError('')
    uploadDocument(file)
  }

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const statusColors = {
    Pending: 'bg-primary/10 text-primary',
    Approved: 'bg-secondary/10 text-secondary',
    Rejected: 'bg-error/10 text-error'
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div
        className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-3xl font-jakarta font-bold overflow-hidden border-2 border-surface-container">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={profile.companyName} className="w-full h-full object-cover" />
            ) : (
              profile.companyName[0]
            )}
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
          <button
            onClick={() => logoInputRef.current?.click()}
            className="text-[12px] font-jakarta font-semibold text-primary hover:underline"
          >
            Change Photo
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-jakarta font-semibold text-on-surface">{profile.companyName}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-jakarta font-semibold ${statusColors[profile.approvalStatus]}`}>
              {profile.approvalStatus}
            </span>
          </div>
          <p className="text-sm font-lexend text-on-surface-variant mt-1">{profile.address}</p>
        </div>
        {!isEditing && activeTab === 'details' && (
          <Button variant="ghost" onClick={() => setIsEditing(true)} aria-label="Edit profile">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1 w-fit">
        {(['details', 'location', 'documents'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all ${
              activeTab === tab
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab === 'details' ? 'Details' : tab === 'location' ? 'Location' : 'Documents'}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div
          className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 space-y-5"
          style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
        >
          <div className="flex flex-col gap-2">
            <label className="font-jakarta text-sm font-semibold text-on-surface-variant">Company Biography</label>
            {isEditing ? (
              <div>
                <textarea
                  value={form.biography}
                  onChange={e => setForm(prev => ({ ...prev, biography: e.target.value.slice(0, 500) }))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-lexend text-on-surface placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors resize-none h-32"
                  placeholder="Tell us about your company..."
                />
                <span className="text-xs font-lexend text-on-surface-variant">{form.biography.length}/500</span>
              </div>
            ) : (
              <p className="font-lexend text-on-surface leading-relaxed">{profile.biography}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Address"
              value={isEditing ? form.address : profile.address}
              onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
              disabled={!isEditing}
              icon={<span className="material-symbols-outlined text-[20px]">location_on</span>}
            />
            <Input
              label="Contact Email"
              value={isEditing ? form.contactEmail : profile.contactEmail}
              onChange={e => setForm(prev => ({ ...prev, contactEmail: e.target.value }))}
              disabled={!isEditing}
              icon={<span className="material-symbols-outlined text-[20px]">mail</span>}
            />
            <Input
              label="Phone"
              value={isEditing ? form.phone : profile.phone}
              onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              icon={<span className="material-symbols-outlined text-[20px]">phone</span>}
            />
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            </div>
          )}
        </div>
      )}

      {/* Location Tab */}
      {activeTab === 'location' && (
        <div
          className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 space-y-4"
          style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
        >
          <OsmMapPicker
            value={pendingLocation}
            onChange={handleLocationChange}
            onAddressChange={setPendingAddress}
          />
          {(pendingLocation ?? profile.location) && (
            <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-secondary">location_on</span>
              <div>
                <p className="font-jakarta font-semibold text-on-surface text-sm">Selected Location</p>
                {(pendingLocation ? pendingAddress : profile.locationAddress) ? (
                  <p className="font-lexend text-on-surface-variant text-sm">
                    {pendingLocation ? pendingAddress : profile.locationAddress}
                  </p>
                ) : (
                  <p className="font-lexend text-on-surface-variant text-sm">
                    Lat: {(pendingLocation ?? profile.location)?.lat.toFixed(4)}, Lng: {(pendingLocation ?? profile.location)?.lng.toFixed(4)}
                  </p>
                )}
                {addressStatus === 'loading' && (
                  <p className="font-lexend text-xs text-outline mt-1">Fetching address...</p>
                )}
                {addressStatus === 'error' && (
                  <p className="font-lexend text-xs text-outline mt-1">Unable to fetch address. Showing coordinates only.</p>
                )}
              </div>
            </div>
          )}
          {!pendingLocation && !profile.location && (
            <p className="font-lexend text-on-surface-variant text-sm text-center py-2">
              No location set yet. Click on the map to set your company&apos;s location.
            </p>
          )}
          <Button onClick={handleSaveLocation} disabled={!pendingLocation}>
            Save Location
          </Button>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div
          className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 space-y-4"
          style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-jakarta font-semibold text-on-surface">Uploaded Documents</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => documentInputRef.current?.click()}
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Upload PDF
            </Button>
          </div>
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={event => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (file) {
                handleDocumentUpload(file)
              }
            }}
          />
          {documentError && (
            <p className="text-sm font-lexend text-error bg-error/5 p-3 rounded-lg border border-error/20">
              {documentError}
            </p>
          )}

          {profile.documents.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-[48px] text-outline/40">description</span>
              <p className="font-lexend text-on-surface-variant mt-2">No documents uploaded yet.</p>
              <p className="font-lexend text-outline text-sm">Upload tax certificates or other verification documents.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {profile.documents.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-error">picture_as_pdf</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-jakarta font-semibold text-sm text-on-surface truncate">{doc.name}</p>
                    <p className="font-lexend text-xs text-on-surface-variant">
                      Uploaded {doc.uploadedAt} · {formatFileSize(doc.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors focus-visible:ring-2 focus-visible:ring-secondary"
                    aria-label={`Remove ${doc.name}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <FeedbackDialog
        isOpen={showSuccessDialog}
        title="Success"
        message={successMessage}
        actionLabel="OK"
        onClose={() => setShowSuccessDialog(false)}
      />
    </div>
  )
}
