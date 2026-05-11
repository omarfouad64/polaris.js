import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import Button from '../../components/Button'

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  let errorMessage = 'An unexpected error has occurred.'
  let errorTitle = 'Oops! Something went wrong'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorTitle = '404 - Page Not Found'
      errorMessage = "The page you're looking for doesn't exist or has been moved."
    } else if (error.status === 401) {
      errorTitle = '401 - Unauthorized'
      errorMessage = "You don't have permission to access this page."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 antialiased font-lexend overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary-container/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary-container/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-xl w-full text-center space-y-12 relative z-10">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-error-container rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
            <span className="material-symbols-outlined text-error text-[64px]">warning</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-jakarta text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
            {errorTitle}
          </h1>
          <p className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-md mx-auto">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            variant="primary" 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8"
          >
            Back to Safety
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate('/auth/login')}
            className="w-full sm:w-auto px-8"
          >
            Try Logging In
          </Button>
        </div>

        <div className="pt-12 border-t border-outline-variant/30 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-outline font-bold tracking-widest text-[10px] uppercase">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            Need help?
          </div>
          <div className="h-4 w-px bg-outline-variant"></div>
          <a href="mailto:support@polaris.com" className="text-primary font-bold text-sm hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  )
}
