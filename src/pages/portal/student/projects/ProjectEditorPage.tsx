import { useParams, useNavigate } from 'react-router-dom';
import ProjectEditor from './components/ProjectEditor';

/**
 * ProjectEditorPage — Page wrapper for the ProjectEditor component.
 * Handles URL parameters and navigation after save/cancel.
 */
export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSave = () => {
    navigate('/portal/student/projects');
  };

  const handleCancel = () => {
    navigate('/portal/student/projects');
  };

  return (
    <div className="min-h-screen bg-background p-[--spacing-polaris-md] md:p-[--spacing-polaris-lg]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="text-sm font-jakarta font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
          >
            ← Back to Projects
          </button>
        </div>
        <ProjectEditor
          projectId={id === 'new' ? undefined : id}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
