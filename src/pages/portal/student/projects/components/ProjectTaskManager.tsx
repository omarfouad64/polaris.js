import { useState } from 'react';
import { type ProjectTask } from '../scripts/useStudentProjects';
import { useProjectInvitations } from '../../../../../hooks/useProjectInvitations';
import { useInstructorFeedback } from '../../../../../hooks/useInstructorFeedback';
import useNotifications from '../../../../../hooks/useNotifications';
import Button from '../../../../../components/Button';
import TaskFeedbackForm from './TaskFeedbackForm';

interface ProjectTaskManagerProps {
  projectId: string;
  tasks: ProjectTask[];
  onTasksChange: (tasks: ProjectTask[]) => void;
  isOwner: boolean;
  isInstructor?: boolean;
  currentUserId: string;
  userName?: string;
}

/**
 * ProjectTaskManager — Component for managing project tasks.
 * Allows creator to manage all tasks and collaborators to update their own task status.
 */
export default function ProjectTaskManager({
  projectId,
  tasks,
  onTasksChange,
  isOwner,
  isInstructor = false,
  currentUserId,
  userName = 'Unknown User',
}: ProjectTaskManagerProps) {
  const { collaborators } = useProjectInvitations(projectId, currentUserId);
  const { addNotification } = useNotifications();
  const { 
    getTaskFeedback, 
    removeTaskFeedback 
  } = useInstructorFeedback(projectId);
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [feedbackTaskId, setFeedbackTaskId] = useState<string | null>(null);
  const [feedbackTaskTitle, setFeedbackTaskTitle] = useState('');

  // New task form state
  const [taskForm, setTaskForm] = useState<Omit<ProjectTask, 'id'>>({
    description: '',
    assigneeId: '',
    status: 'pending',
    deadline: '',
  });

  const handleAddTask = () => {
    if (!taskForm.description || !taskForm.assigneeId || !taskForm.deadline) return;

    const newTask: ProjectTask = {
      ...taskForm,
      id: `task-${Date.now()}`,
    };

    onTasksChange([...tasks, newTask]);
    setTaskForm({ description: '', assigneeId: '', status: 'pending', deadline: '' });
    setIsAddingTask(false);
  };

  const handleUpdateTask = (id: string, updates: Partial<ProjectTask>) => {
    onTasksChange(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    setEditingTaskId(null);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Delete this task?')) {
      onTasksChange(tasks.filter((t) => t.id !== id));
    }
  };

  const getAssigneeName = (id: string) => {
    const collaborator = collaborators.find((c) => c.collaboratorId === id);
    return collaborator ? collaborator.name : 'Unknown';
  };

  const statusColors = {
    pending: 'bg-surface-container text-on-surface-variant',
    'post-poned': 'bg-tertiary-container text-on-tertiary-container',
    completed: 'bg-secondary-container text-on-secondary-container',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-jakarta font-bold text-on-surface">Project Tasks</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Assign and track project milestones
          </p>
        </div>
        {isOwner && (
          <Button variant="primary" onClick={() => setIsAddingTask(true)}>
            + Add Task
          </Button>
        )}
      </div>

      {/* Task List */}
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
        {tasks.length > 0 ? (
          <div className="divide-y divide-surface-container-high">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-surface-container-low transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-jakarta font-semibold text-on-surface">{task.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">person</span>
                        {getAssigneeName(task.assigneeId)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Status Dropdown */}
                    {(isOwner || task.assigneeId === currentUserId) ? (
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTask(task.id, { status: e.target.value as any })}
                        className={`text-xs font-jakarta font-semibold px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-primary/20 ${statusColors[task.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="post-poned">Post-poned</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <span className={`text-xs font-jakarta font-semibold px-3 py-1.5 rounded-full ${statusColors[task.status]}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    )}

                    {/* Creator/Instructor Actions */}
                    <div className="flex items-center gap-1">
                      {isInstructor && (
                        <button
                          onClick={() => {
                            setFeedbackTaskId(task.id);
                            setFeedbackTaskTitle(task.description);
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                          title="Add feedback"
                        >
                          <span className="material-symbols-outlined text-xl">comment</span>
                        </button>
                      )}
                      {isOwner && (
                        <>
                          <button
                            onClick={() => setEditingTaskId(task.id)}
                            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
                            title="Edit task"
                          >
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                            title="Delete task"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Task Feedback List */}
                {getTaskFeedback(task.id).length > 0 && (
                  <div className="mt-3 ml-4 pl-4 border-l-2 border-primary/20 space-y-2">
                    {getTaskFeedback(task.id).map((fb) => (
                      <div key={fb.id} className="bg-primary/5 rounded-lg p-3 relative group">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-jakarta font-bold text-primary mb-1">
                            {fb.instructorName} • {new Date(fb.createdAt).toLocaleDateString()}
                          </p>
                          {isInstructor && fb.instructorId === currentUserId && (
                            <button
                              onClick={() => removeTaskFeedback(task.id, fb.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-error hover:bg-error/10 rounded transition-all"
                              title="Delete feedback"
                            >
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-on-surface leading-relaxed">{fb.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="bg-surface-container-high w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl">task</span>
            </div>
            <h3 className="text-lg font-jakarta font-bold text-on-surface">No tasks yet</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Start by adding project tasks and assigning them to team members.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {(isAddingTask || editingTaskId) && (
        <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg shadow-floating border border-surface-container-high">
            <h2 className="text-2xl font-jakarta font-bold text-on-surface mb-6">
              {isAddingTask ? 'Add New Task' : 'Edit Task'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                  Task Description (1 line)
                </label>
                <input
                  type="text"
                  value={isAddingTask ? taskForm.description : tasks.find(t => t.id === editingTaskId)?.description}
                  onChange={(e) => isAddingTask ? setTaskForm({ ...taskForm, description: e.target.value }) : handleUpdateTask(editingTaskId!, { description: e.target.value })}
                  placeholder="e.g., Implement login form"
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                  Assignee
                </label>
                <select
                  value={isAddingTask ? taskForm.assigneeId : tasks.find(t => t.id === editingTaskId)?.assigneeId}
                  onChange={(e) => isAddingTask ? setTaskForm({ ...taskForm, assigneeId: e.target.value }) : handleUpdateTask(editingTaskId!, { assigneeId: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a collaborator</option>
                  {collaborators.map(c => (
                    <option key={c.collaboratorId} value={c.collaboratorId}>
                      {c.name} ({c.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={isAddingTask ? taskForm.deadline : tasks.find(t => t.id === editingTaskId)?.deadline}
                  onChange={(e) => isAddingTask ? setTaskForm({ ...taskForm, deadline: e.target.value }) : handleUpdateTask(editingTaskId!, { deadline: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingTask(false);
                  setEditingTaskId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={isAddingTask ? handleAddTask : () => setEditingTaskId(null)}
                disabled={isAddingTask && (!taskForm.description || !taskForm.assigneeId || !taskForm.deadline)}
              >
                {isAddingTask ? 'Create Task' : 'Done'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Task Feedback Modal */}
      <TaskFeedbackForm
        projectId={projectId}
        taskId={feedbackTaskId || ''}
        taskTitle={feedbackTaskTitle}
        instructorId={currentUserId}
        instructorName={userName}
        isOpen={!!feedbackTaskId}
        onClose={() => setFeedbackTaskId(null)}
        onFeedbackSubmitted={() => {
          addNotification({
            type: 'feedback',
            title: 'New Task Feedback',
            body: `${userName} left feedback on task: "${feedbackTaskTitle}"`,
          });
          setFeedbackTaskId(null);
        }}
      />
    </div>
  );
}
