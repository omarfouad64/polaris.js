import { useState } from 'react';
import useStudentProjects, { type ProjectData, type ThesisDraft } from '../scripts/useStudentProjects';
import CourseSelector from './CourseSelector';
import LanguageMultiSelect from './LanguageMultiSelect';
import VideoUploader from './VideoUploader';
import ThesisDraftUploader from './ThesisDraftUploader';
import Button from '../../../../../components/Button';
import ConfirmationDialog from '../../../../../components/ConfirmationDialog';

interface ProjectEditorProps {
  projectId?: string;
  currentUserId?: string;
  onSave?: (project: ProjectData) => void;
  onCancel?: () => void;
}

/**
 * ProjectEditor — Form to create or edit a project.
 *
 * @param projectId - Optional project ID for editing. If not provided, form is in create mode.
 * @param onSave - Optional callback when project is saved.
 * @param onCancel - Optional callback when editing is cancelled.
 */
export default function ProjectEditor({
  projectId,
  currentUserId,
  onSave,
  onCancel,
}: ProjectEditorProps) {
  const { getProjectById, createProject, updateProject } = useStudentProjects(currentUserId);

  const isEditMode = !!projectId && projectId !== 'new';
  const existingProject = isEditMode ? getProjectById(projectId) : undefined;

  const [formData, setFormData] = useState<
    Omit<ProjectData, 'id' | 'ownerId' | 'createdDate' | 'updatedDate'>
  >({
    title: existingProject?.title || '',
    course: existingProject?.course || '',
    githubLink: existingProject?.githubLink || '',
    projectReport: existingProject?.projectReport || '',
    languages: existingProject?.languages || [],
    demoVideoUrl: existingProject?.demoVideoUrl || '',
    thesisDrafts: existingProject?.thesisDrafts || [],
    tasks: existingProject?.tasks || [],
    isPublic: existingProject?.isPublic ?? true,
    status: existingProject?.status ?? 'active',
    flagReason: existingProject?.flagReason,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.course) {
      newErrors.course = 'Course is required';
    }

    if (formData.languages.length === 0) {
      newErrors.languages = 'At least one programming language is required';
    }

    if (formData.projectReport.length > 5000) {
      newErrors.projectReport = 'Project report must be less than 5000 characters';
    }

    if (formData.demoVideoUrl && !isValidUrl(formData.demoVideoUrl)) {
      newErrors.demoVideoUrl = 'Invalid video URL format';
    }

    if (formData.githubLink && !isValidUrl(formData.githubLink)) {
      newErrors.githubLink = 'Invalid GitHub URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCourseChange = (courseId: string) => {
    setFormData((prev) => ({ ...prev, course: courseId }));
    if (errors.course) {
      setErrors((prev) => ({ ...prev, course: '' }));
    }
  };

  const handleLanguagesChange = (languages: string[]) => {
    setFormData((prev) => ({ ...prev, languages }));
    if (errors.languages) {
      setErrors((prev) => ({ ...prev, languages: '' }));
    }
  };

  const handleVideoUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, demoVideoUrl: url }));
    if (errors.demoVideoUrl) {
      setErrors((prev) => ({ ...prev, demoVideoUrl: '' }));
    }
  };

  const handleVideoRemove = () => {
    setFormData((prev) => ({ ...prev, demoVideoUrl: '' }));
  };

  const handleThesisDraftsChange = (thesisDrafts: ThesisDraft[]) => {
    setFormData((prev) => ({ ...prev, thesisDrafts }));
  };

  const saveProject = async () => {
    setIsSubmitting(true);

    try {
      let savedProject: ProjectData;
      if (isEditMode && projectId) {
        updateProject(projectId, formData);
        savedProject = { ...existingProject, ...formData, id: projectId, updatedDate: new Date().toISOString().split('T')[0] } as ProjectData;
      } else {
        savedProject = createProject(formData);
      }

      onSave?.(savedProject);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditMode) {
      setShowEditConfirm(true);
      return;
    }

    await saveProject();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/40"
    >
      <h1 className="text-3xl font-jakarta font-bold text-on-background mb-2">
        {isEditMode ? 'Edit Project' : 'Create New Project'}
      </h1>
      <p className="text-base font-lexend text-on-surface-variant mb-8">
        {isEditMode
          ? 'Update your project details below.'
          : 'Enter your project information to get started.'}
      </p>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-jakarta font-semibold uppercase tracking-widest text-on-surface mb-2">
          Project Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., E-Commerce Platform"
          maxLength={200}
          className={`w-full bg-surface-container-low border rounded-lg px-4 py-3 text-base font-lexend text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 transition-colors duration-150 ${errors.title
            ? 'border-error focus:border-error focus:ring-error/20'
            : 'border-outline-variant focus:border-secondary focus:ring-secondary/20'
            }`}
        />
        {errors.title && (
          <p className="text-sm text-error mt-1 font-lexend">{errors.title}</p>
        )}
        <p className="text-xs text-on-surface-variant mt-1 font-lexend">
          {formData.title.length}/200
        </p>
      </div>

      {/* Course */}
      <div className="mb-6">
        <label className="block text-sm font-jakarta font-semibold uppercase tracking-widest text-on-surface mb-2">
          Course *
        </label>
        <CourseSelector
          selectedCourse={formData.course}
          onSelectCourse={handleCourseChange}
        />
        {errors.course && (
          <p className="text-sm text-error mt-1 font-lexend">{errors.course}</p>
        )}
      </div>

      {/* GitHub Link */}
      <div className="mb-6">
        <label className="block text-sm font-jakarta font-semibold uppercase tracking-widest text-on-surface mb-2">
          GitHub Link
        </label>
        <input
          type="url"
          name="githubLink"
          value={formData.githubLink}
          onChange={handleInputChange}
          placeholder="https://github.com/your-username/repo-name"
          className={`w-full bg-surface-container-low border rounded-lg px-4 py-3 text-base font-lexend text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 transition-colors duration-150 ${errors.githubLink
            ? 'border-error focus:border-error focus:ring-error/20'
            : 'border-outline-variant focus:border-secondary focus:ring-secondary/20'
            }`}
        />
        {errors.githubLink && (
          <p className="text-sm text-error mt-1 font-lexend">
            {errors.githubLink}
          </p>
        )}
      </div>

      {/* Programming Languages */}
      <div className="mb-6">
        <LanguageMultiSelect
          selectedLanguages={formData.languages}
          onSelectLanguages={handleLanguagesChange}
        />
        {errors.languages && (
          <p className="text-sm text-error mt-1 font-lexend">{errors.languages}</p>
        )}
      </div>

      {/* Project Report */}
      <div className="mb-6">
        <label className="block text-sm font-jakarta font-semibold uppercase tracking-widest text-on-surface mb-2">
          Project Report
        </label>
        <textarea
          name="projectReport"
          value={formData.projectReport}
          onChange={handleInputChange}
          placeholder="Describe your project, its purpose, implementation details, and outcomes..."
          maxLength={5000}
          rows={6}
          className={`w-full bg-surface-container-low border rounded-lg px-4 py-3 text-base font-lexend text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 transition-colors duration-150 resize-none ${errors.projectReport
            ? 'border-error focus:border-error focus:ring-error/20'
            : 'border-outline-variant focus:border-secondary focus:ring-secondary/20'
            }`}
        />
        {errors.projectReport && (
          <p className="text-sm text-error mt-1 font-lexend">
            {errors.projectReport}
          </p>
        )}
        <p className="text-xs text-on-surface-variant mt-1 font-lexend">
          {formData.projectReport.length}/5000
        </p>
      </div>

      {/* Demo Video */}
      <div className="mb-6">
        <VideoUploader
          videoUrl={formData.demoVideoUrl}
          onVideoUrlChange={handleVideoUrlChange}
          onRemove={handleVideoRemove}
        />
        {errors.demoVideoUrl && (
          <p className="text-sm text-error mt-1 font-lexend">
            {errors.demoVideoUrl}
          </p>
        )}
      </div>
      
      {/* Thesis Drafts (Bachelor Project only) */}
      {formData.course === 'course-001' && (
        <ThesisDraftUploader
          drafts={formData.thesisDrafts}
          onDraftsChange={handleThesisDraftsChange}
        />
      )}

      {/* Visibility Toggle */}
      <div className="mb-8 p-4 bg-surface-container rounded-lg border border-outline-variant/40">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))
            }
            className="w-5 h-5 rounded cursor-pointer accent-primary"
          />
          <span className="text-base font-lexend text-on-surface">
            Make this project public on my portfolio
          </span>
        </label>
        <p className="text-sm font-lexend text-on-surface-variant mt-2 ml-8">
          {formData.isPublic
            ? 'This project will be visible to all users.'
            : 'This project is private and only visible to you.'}
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : isEditMode
              ? 'Update Project'
              : 'Create Project'}
        </Button>
      </div>
      <ConfirmationDialog
        isOpen={showEditConfirm}
        title="Confirm Project Updates"
        message="Save these changes to your project? The updated details will replace the existing information."
        confirmLabel="Save Changes"
        cancelLabel="Cancel"
        onConfirm={() => {
          setShowEditConfirm(false)
          void saveProject()
        }}
        onCancel={() => setShowEditConfirm(false)}
      />
    </form>
  );
}
