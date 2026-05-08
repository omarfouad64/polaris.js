import { useState, useEffect } from 'react'
import { useInstructorProfile } from '../../../../hooks/useInstructorProfile'
import { useGlobalContext } from '../../../../globalContext'

interface ProfileSection {
  id: 'about' | 'research' | 'education'
  label: string
}

const PROFILE_SECTIONS: ProfileSection[] = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research Interests' },
  { id: 'education', label: 'Education' }
]

/**
 * InstructorProfilePage – allows course instructors to manage their profile.
 * Supports editing biography, research interests, and education background.
 * Displays profile information in a tabbed interface.
 */
export default function InstructorProfilePage() {
  const { updateUser, user } = useGlobalContext()
  // State management
  const [activeSection, setActiveSection] = useState<'about' | 'research' | 'education'>('about')
  const [isEditing, setIsEditing] = useState(false)
  const [newResearchInterest, setNewResearchInterest] = useState('')
  
  // Edit mode states
  const [editBiography, setEditBiography] = useState('')
  const [editEducation, setEditEducation] = useState('')

  // Hook for instructor profile
  const {
    profile,
    updateBiography,
    updateEducationBackground,
    addResearchInterest,
    removeResearchInterest,
    updateProfilePicture
  } = useInstructorProfile()

  // Sync initial user data if available
  useEffect(() => {
    if (user && !profile.profilePicture && user.profilePicture) {
       updateProfilePicture(user.profilePicture)
    }
  }, [])

  // Handler: Start editing mode
  const handleEditStart = () => {
    setEditBiography(profile.biography)
    setEditEducation(profile.educationBackground)
    setIsEditing(true)
  }

  // Handler: Save changes
  const handleSaveChanges = () => {
    updateBiography(editBiography)
    updateEducationBackground(editEducation)
    setIsEditing(false)
  }

  // Handler: Add research interest
  const handleAddResearchInterest = () => {
    if (newResearchInterest.trim()) {
      addResearchInterest(newResearchInterest.trim())
      setNewResearchInterest('')
    }
  }

  // Handler: Remove research interest
  const handleRemoveResearchInterest = (interest: string) => {
    removeResearchInterest(interest)
  }

  // Handler: Upload profile picture
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const pictureUrl = e.target?.result as string
        updateProfilePicture(pictureUrl)
        updateUser({ profilePicture: pictureUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-jakarta font-bold text-on-surface mb-2">
          My Profile
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Manage your professional profile and course associations
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm mb-8 overflow-hidden">
        <div className="p-6 lg:p-8">
          {/* Profile Header Section */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-surface-container-high">
            {/* Profile Picture */}
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary-container text-primary text-3xl font-jakarta font-bold overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{profile.name.charAt(0)}</span>
                )}
              </div>
              <label className="mt-4 block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  aria-label="Upload profile picture"
                />
                <button
                  onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  className="w-full px-3 py-2 text-sm font-jakarta font-semibold text-primary hover:bg-primary-container/20 rounded-lg transition-colors"
                >
                  Change Photo
                </button>
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-jakarta font-bold text-on-surface mb-1">{profile.name}</h2>
              <p className="text-body-md text-on-surface-variant mb-4">{profile.email}</p>
              <p className="text-body-sm text-on-surface-variant mb-6">
                Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
              </p>
              <button
                onClick={handleEditStart}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-jakarta font-semibold hover:bg-primary-container transition-colors"
              >
                {isEditing ? 'Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-surface-container-high overflow-x-auto">
            {PROFILE_SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 font-jakarta font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
                  activeSection === section.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* SECTION 1: About Tab */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              {isEditing ? (
                // Edit Mode
                <div className="space-y-6">
                  {/* Biography Textarea */}
                  <div>
                    <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                      Biography
                    </label>
                    <textarea
                      value={editBiography}
                      onChange={(e) => setEditBiography(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="Write about yourself, your expertise, and teaching philosophy..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveChanges}
                      className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-jakarta font-semibold hover:bg-secondary-container transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-outline text-on-surface rounded-lg font-jakarta font-semibold hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-3">Biography</p>
                  <p className="text-body-md text-on-surface leading-relaxed">{profile.biography}</p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: Research Interests Tab */}
          {activeSection === 'research' && (
            <div className="space-y-6">
              {/* Research Interests Display */}
              <div>
                <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-4">Your Research Interests</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.researchInterests.length > 0 ? (
                    profile.researchInterests.map(interest => (
                      <div
                        key={interest}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-container rounded-full"
                      >
                        <span className="text-sm font-lexend text-on-primary-container">{interest}</span>
                        <button
                          onClick={() => handleRemoveResearchInterest(interest)}
                          className="text-on-primary-container hover:opacity-70 transition-opacity"
                          aria-label={`Remove ${interest}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-body-sm text-on-surface-variant">
                      No research interests added yet. Add your first one below!
                    </p>
                  )}
                </div>
              </div>

              {/* Add Research Interest Input */}
              <div>
                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                  Add a Research Interest
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newResearchInterest}
                    onChange={(e) => setNewResearchInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddResearchInterest()}
                    className="flex-1 px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                    placeholder="e.g., Cloud Computing, AI, Cybersecurity"
                  />
                  <button
                    onClick={handleAddResearchInterest}
                    className="px-6 py-2 bg-primary text-on-primary rounded-lg font-jakarta font-semibold hover:bg-primary-container transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Education Tab */}
          {activeSection === 'education' && (
            <div className="space-y-6">
              {isEditing ? (
                // Edit Mode
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                      Education Background
                    </label>
                    <textarea
                      value={editEducation}
                      onChange={(e) => setEditEducation(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="List your degrees, certifications, and educational institutions..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveChanges}
                      className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-jakarta font-semibold hover:bg-secondary-container transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-outline text-on-surface rounded-lg font-jakarta font-semibold hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-3">Education Background</p>
                  <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
                    {profile.educationBackground}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-surface-container rounded-xl p-6 border border-surface-container-high">
        <h3 className="font-jakarta font-semibold text-on-surface mb-2">💡 Profile Tips</h3>
        <ul className="text-body-sm text-on-surface-variant space-y-1">
          <li>• Keep your biography updated and informative</li>
          <li>• Add research interests relevant to your field</li>
          <li>• Highlight your educational background and qualifications</li>
          <li>• Your profile is visible to students and administrators</li>
        </ul>
      </div>
    </div>
  )
}