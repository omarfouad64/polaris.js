import { ProjectData } from '../scripts/useStudentProjects';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: ProjectData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  isLoading?: boolean;
}

/**
 * ProjectList — Renders a grid of project cards.
 *
 * @param projects - Array of project data to display.
 * @param onEdit - Callback when edit button is clicked.
 * @param onDelete - Callback when delete button is clicked.
 * @param onView - Callback when view button is clicked.
 * @param isLoading - Optional loading state indicator.
 */
export default function ProjectList({
  projects,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-xl p-6 animate-pulse h-64 border border-outline-variant/40"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          {...project}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}
