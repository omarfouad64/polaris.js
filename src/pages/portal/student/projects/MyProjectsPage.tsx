import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStudentProjects, { type ProjectData } from './scripts/useStudentProjects';
import ProjectList from './components/ProjectList';
import Button from '../../../../components/Button';

/**
 * MyProjectsPage — Displays student's project list with CRUD controls.
 * Entry point for Requirement 19.
 */
export default function MyProjectsPage() {
  const navigate = useNavigate();
  const { projects, deleteProject, isLoading } = useStudentProjects();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    navigate(`/portal/student/projects/${id}`);
  };

  const handleCreate = () => {
    navigate(`/portal/student/projects/new`);
  };

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteProject(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleView = (id: string) => {
    // TODO: Navigate to project detail view (Req 46)
    console.log('View project:', id);
  };

  return (
    <div className="min-h-screen bg-background p-[--spacing-polaris-md] md:p-[--spacing-polaris-lg]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-[--spacing-polaris-md] mb-[--spacing-polaris-lg]">
          <h1 className="text-3xl font-jakarta font-bold text-on-background">My Projects</h1>
          <p className="text-base font-lexend text-on-surface-variant">
            Manage your projects, view details, and control portfolio visibility.
          </p>
        </div>

        {/* Create Project Button */}
        <div className="mb-[--spacing-polaris-lg]">
          <Button variant="primary" onClick={handleCreate}>
            + Create New Project
          </Button>
        </div>

        {/* Project List */}
        {projects.length > 0 ? (
          <ProjectList
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            isLoading={isLoading}
          />
        ) : (
          <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/40">
            <p className="text-lg font-lexend text-on-surface-variant mb-4">
              No projects yet. Create your first project to get started!
            </p>
            <Button variant="primary" onClick={handleCreate}>
              Create Your First Project
            </Button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg shadow-floating">
              <h2 className="text-2xl font-jakarta font-semibold text-on-background mb-4">
                Delete Project?
              </h2>
              <p className="text-base font-lexend text-on-surface mb-6">
                This action cannot be undone. Your project and all associated data will be permanently deleted.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmDelete}
                  className="bg-error hover:opacity-90"
                >
                  Delete Project
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
