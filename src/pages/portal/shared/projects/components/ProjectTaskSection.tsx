import { useState } from 'react';
import { type ProjectTask } from '../../../student/projects/scripts/useStudentProjects';
import { useProjectInvitations } from '../../../../../hooks/useProjectInvitations';
import { useInstructorFeedback } from '../../../../../hooks/useInstructorFeedback';
import { useGlobalContext } from '../../../../../globalContext';
import TaskFeedbackForm from './TaskFeedbackForm';

interface ProjectTaskSectionProps {
  projectId: string;
  tasks: ProjectTask[];
  currentUserId?: string;
}

/**
 * ProjectTaskSection — Displays a list of project tasks with instructor feedback capabilities.
 */
export default function ProjectTaskSection({
  projectId,
  tasks = [],
  currentUserId = 'viewer',
}: ProjectTaskSectionProps) {
  const { user } = useGlobalContext();
  const isInstructor = user?.role === 'Course Instructor';

  const { collaborators } = useProjectInvitations(projectId, currentUserId);
  const { taskFeedback, addTaskFeedback, editTaskFeedback, removeTaskFeedback, getTaskFeedback } = useInstructorFeedback(projectId);

  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);
  const [editingFeedback, setEditingFeedback] = useState<{ id: string; comment: string } | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const getAssigneeName = (id: string) => {
    const collaborator = collaborators.find((c) => c.collaboratorId === id);
    return collaborator ? collaborator.name : 'Unknown';
  };

  const statusConfig = {
    pending: {
      label: 'Pending',
      bg: 'bg-surface-container',
      text: 'text-on-surface-variant',
      icon: 'schedule',
    },
    'post-poned': {
      label: 'Post-poned',
      bg: 'bg-tertiary-container',
      text: 'text-on-tertiary-container',
      icon: 'timer_off',
    },
    completed: {
      label: 'Completed',
      bg: 'bg-secondary-container',
      text: 'text-on-secondary-container',
      icon: 'check_circle',
    },
  };

  const importanceConfig = {
    High: 'text-error bg-error/5 border-error/20',
    Medium: 'text-secondary bg-secondary/5 border-secondary/20',
    Low: 'text-on-surface-variant bg-surface-container-high border-outline-variant/20',
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const importanceOrder = { High: 3, Medium: 2, Low: 1 };
    return (importanceOrder[b.importance] || 0) - (importanceOrder[a.importance] || 0);
  });

  const handleAddFeedback = (task: ProjectTask) => {
    setSelectedTask({ id: task.id, title: task.description });
    setEditingFeedback(null);
    setIsFeedbackModalOpen(true);
  };

  const handleEditFeedback = (task: ProjectTask, feedback: any) => {
    setSelectedTask({ id: task.id, title: task.description });
    setEditingFeedback({ id: feedback.id, comment: feedback.comment });
    setIsFeedbackModalOpen(true);
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-3xl p-10 border border-outline-variant/30 text-center space-y-4">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-on-surface-variant/40">
          <span className="material-symbols-outlined text-3xl">task</span>
        </div>
        <div>
          <h4 className="font-jakarta font-bold text-on-surface">No tasks listed</h4>
          <p className="text-sm font-lexend text-on-surface-variant mt-1">
            This project hasn't shared its task roadmap yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-secondary">
          <span className="material-symbols-outlined text-[24px]">assignment</span>
        </div>
        <div>
          <h3 className="text-xl font-jakarta font-bold text-on-surface">Project Tasks</h3>
          <p className="text-xs font-lexend text-on-surface-variant">
            Current milestones and progress status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedTasks.map((task) => {
          const config = statusConfig[task.status] || statusConfig.pending;
          const impClass = importanceConfig[task.importance] || importanceConfig.Low;
          const feedback = getTaskFeedback(task.id)[0]; // Assuming one feedback per instructor for now
          
          return (
            <div
              key={task.id}
              className="group p-6 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 hover:border-secondary/30 hover:bg-surface-container-low transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-jakarta font-bold uppercase tracking-wider flex items-center gap-1.5 ${config.bg} ${config.text}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{config.icon}</span>
                      {config.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-jakarta font-bold border ${impClass}`}>
                      {task.importance}
                    </span>
                  </div>
                  <span className="text-[10px] font-lexend text-on-surface-variant font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {new Date(task.deadline).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="font-jakarta font-bold text-on-surface group-hover:text-secondary transition-colors line-clamp-2">
                  {task.description}
                </p>
              </div>

              <div className="flex items-center gap-2 py-3 border-y border-outline-variant/10">
                <div className="w-6 h-6 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-jakarta font-bold text-[10px]">
                  {getAssigneeName(task.assigneeId).charAt(0)}
                </div>
                <span className="text-xs font-lexend text-on-surface-variant font-medium">
                  {getAssigneeName(task.assigneeId)}
                </span>
              </div>

              {/* Feedback Section */}
              <div className="space-y-3">
                {feedback ? (
                  <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-jakarta font-bold text-primary uppercase tracking-wider">Instructor Feedback</span>
                      {isInstructor && (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleEditFeedback(task, feedback)}
                            className="text-[18px] material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                          >
                            edit_note
                          </button>
                          <button 
                            onClick={() => removeTaskFeedback(feedback.id)}
                            className="text-[18px] material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
                          >
                            delete
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-lexend text-on-surface-variant leading-relaxed">
                      {feedback.comment}
                    </p>
                  </div>
                ) : (
                  isInstructor && (
                    <button
                      onClick={() => handleAddFeedback(task)}
                      className="w-full py-2 border border-dashed border-outline-variant hover:border-primary/40 hover:bg-primary/5 rounded-xl text-xs font-jakarta font-bold text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_comment</span>
                      Add Feedback
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <TaskFeedbackForm
          projectId={projectId}
          taskId={selectedTask.id}
          taskTitle={selectedTask.title}
          instructorId={user?.username || 'instructor'}
          instructorName={user?.username || 'Course Instructor'}
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          onFeedbackSubmitted={() => setIsFeedbackModalOpen(false)}
          initialFeedback={editingFeedback?.comment}
          feedbackId={editingFeedback?.id}
          addTaskFeedback={addTaskFeedback}
          editTaskFeedback={editTaskFeedback}
        />
      )}
    </div>
  );
}
