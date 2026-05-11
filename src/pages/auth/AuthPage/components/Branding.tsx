
import type { UserRole } from '../../../../types'

interface BrandingProps {
  role: UserRole
}

const brandingData = {
  Student: {
    icon: 'school',
    title: 'Elevate Your Academic Journey.',
    desc: 'Join our collaborative ecosystem designed to bridge the gap between rigorous academia and vibrant project execution.',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070'
  },
  Employer: {
    icon: 'business_center',
    title: 'Discover Top Tier Talent.',
    desc: 'Connect with ambitious students and fresh graduates. Shape the future workforce by offering real-world project experiences.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069'
  },
  'Course Instructor': {
    icon: 'psychology',
    title: 'Mentor the Next Generation.',
    desc: 'Guide students through complex projects and build your academic legacy with our specialized collaboration tools.',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070'
  },
  Administrator: {
    icon: 'admin_panel_settings',
    title: 'Manage the Ecosystem.',
    desc: 'Maintain the integrity and growth of the Polaris network with advanced administrative controls and oversight.',
    img: 'https://images.unsplash.com/photo-1454165833762-02651d58d93c?q=80&w=2070'
  }
}

const avatars = [
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/men/2.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg'
]

export default function Branding({ role }: BrandingProps) {
  const current = brandingData[role]

  return (
    <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-16 overflow-hidden bg-black">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          key={role}
          alt="Branding" 
          className="w-full h-full object-cover opacity-60 transition-opacity duration-700" 
          src={current.img}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40"></div>
      </div>

      {/* Logo Section */}
      <div className="absolute top-16 left-16 z-10 flex items-center gap-4">
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
          <span className="material-symbols-outlined text-white text-[32px] fill-1">explore</span>
        </div>
        <span className="font-jakarta text-3xl font-extrabold text-white tracking-tight">Project Polaris</span>
      </div>

      {/* Info Card Section */}
      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-3xl p-12 shadow-2xl flex flex-col gap-8">
          <h2 className="font-jakarta text-4xl font-extrabold text-white leading-tight">{current.title}</h2>
          <p className="font-lexend text-xl text-white/90 leading-relaxed font-light">
            {current.desc}
          </p>
          <div className="mt-4 flex items-center gap-6 pt-8 border-t border-white/10">
            <div className="flex -space-x-4">
              {avatars.map((url, i) => (
                <img 
                  key={i} 
                  src={url} 
                  alt="User" 
                  className="w-12 h-12 rounded-full border-2 border-white/40 object-cover shadow-2xl" 
                />
              ))}
            </div>
            <div className="font-lexend text-sm text-white/70 font-medium tracking-wide">
              Join 500+ top companies and talent
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
