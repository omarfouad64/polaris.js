import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../../globalContext';
import ProjectEditor from './components/ProjectEditor';

/**
 * ProjectEditorPage — Page wrapper for the ProjectEditor component.
 * Handles URL parameters and navigation after save/cancel.
 */
export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useGlobalContext();

  const [backLabel, setBackLabel] = useState('← Back to Projects');

  useEffect(() => {
    const stored = localStorage.getItem('polaris_back_origin');
    if (stored) {
      if (stored.includes('/student/projects/')) {
        const originProject = stored.split('/').pop();
        setBackLabel(`← Back to ${originProject === id ? 'Project' : 'Other Projects'}`);
      }
    } else {
      localStorage.setItem('polaris_back_origin', location.pathname);
    }
  }, [id, location.pathname]);

  const handleSave = () => {
    navigate('/portal/student/projects');
  };

  const handleCancel = () => {
    const stored = localStorage.getItem('polaris_back_origin');
    if (stored && stored.includes('/student/projects/') && !stored.includes('/collaboration') && !stored.includes('/tasks') && !stored.includes('/settings')) {
      navigate(stored);
    } else {
      navigate('/portal/student/projects');
    }
  };

  return (
    <div className="min-h-screen bg-background p-[--spacing-polaris-md] md:p-[--spacing-polaris-lg]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="text-sm font-jakarta font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
          >
            {backLabel}
          </button>
        </div>
        <ProjectEditor
          projectId={id === 'new' ? undefined : id}
          currentUserId={user?.username}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
