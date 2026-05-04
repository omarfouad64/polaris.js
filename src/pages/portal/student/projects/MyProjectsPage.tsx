import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStudentProjects, { type ProjectData } from './scripts/useStudentProjects';
import ProjectList from './components/ProjectList';
import ProjectFilters from './components/ProjectFilters';
import Button from '../../../../components/Button';

/**
 * MyProjectsPage — Displays student's project list with CRUD controls.
 * Entry point for Requirement 19.
 */
export default function MyProjectsPage() {
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject, isLoading } = useStudentProjects();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');

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
    navigate(`/portal/student/projects/${id}/view`);
  };

  const handleToggleVisibility = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      updateProject(id, { isPublic: !project.isPublic });
    }
  };

  // Filtering logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'public' && project.isPublic) ||
      (visibilityFilter === 'private' && !project.isPublic);

    return matchesSearch && matchesVisibility;
  });

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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-6 mt-4">
          <Button variant="primary" onClick={handleCreate} className="px-8">
            + Create New Project
          </Button>
        </div>

        {/* Filters */}
        <ProjectFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          visibilityFilter={visibilityFilter}
          onVisibilityChange={setVisibilityFilter}
        />

        {/* Project List */}
        {filteredProjects.length > 0 ? (
          <ProjectList
            projects={filteredProjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onToggleVisibility={handleToggleVisibility}
            isLoading={isLoading}
          />
        ) : (
          <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant/40">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-primary text-4xl">
                {searchQuery || visibilityFilter !== 'all' ? 'search_off' : 'rocket_launch'}
              </span>
            </div>
            <h3 className="text-xl font-jakarta font-bold text-on-surface mb-2">
              {searchQuery || visibilityFilter !== 'all'
                ? 'No matches found'
                : 'No projects yet'}
            </h3>
            <p className="text-base font-lexend text-on-surface-variant mb-8 max-w-sm mx-auto">
              {searchQuery || visibilityFilter !== 'all'
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Start by creating your first project to showcase your work to the world."}
            </p>
            {searchQuery || visibilityFilter !== 'all' ? (
              <Button
                variant="outline"
                onClick={() => { setSearchQuery(''); setVisibilityFilter('all'); }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button variant="primary" onClick={handleCreate}>
                Create Your First Project
              </Button>
            )}
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
