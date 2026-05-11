import { useState, useMemo } from 'react';
import { type ProjectTask } from '../scripts/useStudentProjects';
import { useProjectInvitations } from '../../../../../hooks/useProjectInvitations';
import { useInstructorFeedback } from '../../../../../hooks/useInstructorFeedback';
import useNotifications from '../../../../../hooks/useNotifications';
import Button from '../../../../../components/Button';
import ConfirmDialog from '../../../../../components/ConfirmDialog';
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
    tasks = [],
    onTasksChange,
    isOwner,
    isInstructor = false,
    currentUserId,
    userName = 'Unknown User',
}: ProjectTaskManagerProps) {
    const { collaborators } = useProjectInvitations(projectId, currentUserId);
    const { addNotification } = useNotifications();
    const { getTaskFeedback, removeTaskFeedback } = useInstructorFeedback(projectId);

    const projectMemberIds = useMemo(() => {
        const ids = new Set<string>([currentUserId]);
        collaborators.forEach(c => {
            if (c.invitationStatus === 'accepted' && c.email !== currentUserId) {
                ids.add(c.email);
            }
        });
        return Array.from(ids);
    }, [collaborators, currentUserId]);

    // Today's date string in YYYY-MM-DD — used as min for all deadline inputs
    const todayStr = new Date().toISOString().split('T')[0];

    // ── Add task state ──────────────────────────────────────────────────────
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [taskForm, setTaskForm] = useState<Omit<ProjectTask, 'id'>>({
        description: '',
        assigneeId: '',
        status: 'pending',
        importance: 'Medium',
        deadline: '',
    });
    const [addDateError, setAddDateError] = useState('');

    // ── Edit task state (draft — only saved on "Save") ──────────────────────
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState<Omit<ProjectTask, 'id'> | null>(null);
    const [editDateError, setEditDateError] = useState('');

    // ── Delete confirm ──────────────────────────────────────────────────────
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // ── Feedback modal ──────────────────────────────────────────────────────
    const [feedbackTaskId, setFeedbackTaskId] = useState<string | null>(null);
    const [feedbackTaskTitle, setFeedbackTaskTitle] = useState('');

    // ── Handlers ────────────────────────────────────────────────────────────

    const handleAddTask = () => {
        if (!taskForm.description || !taskForm.assigneeId || !taskForm.deadline) return;
        if (taskForm.deadline < todayStr) {
            setAddDateError('Deadline must be today or a future date.');
            return;
        }
        onTasksChange([...tasks, { ...taskForm, id: `task-${Date.now()}` }]);
        setTaskForm({ description: '', assigneeId: '', status: 'pending', importance: 'Medium', deadline: '' });
        setAddDateError('');
        setIsAddingTask(false);
    };

    const openEdit = (task: ProjectTask) => {
        setEditingTaskId(task.id);
        setEditDraft({ description: task.description, assigneeId: task.assigneeId, status: task.status, importance: task.importance, deadline: task.deadline });
        setEditDateError('');
    };

    const handleSaveEdit = () => {
        if (!editDraft || !editingTaskId) return;
        if (editDraft.deadline < todayStr) {
            setEditDateError('Deadline must be today or a future date.');
            return;
        }
        onTasksChange(tasks.map(t => t.id === editingTaskId ? { ...t, ...editDraft } : t));
        setEditingTaskId(null);
        setEditDraft(null);
        setEditDateError('');
    };

    const handleStatusChange = (id: string, status: ProjectTask['status']) => {
        onTasksChange(tasks.map(t => t.id === id ? { ...t, status } : t));
    };

    const statusColors = {
        pending: 'bg-surface-container text-on-surface-variant',
        'post-poned': 'bg-warning-container text-on-warning-container',
        completed: 'bg-secondary-container text-on-secondary-container',
    };

    const importanceColors = {
        High: 'text-error font-bold',
        Medium: 'text-secondary font-semibold',
        Low: 'text-on-surface-variant',
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        const order = { High: 3, Medium: 2, Low: 1 };
        return (order[b.importance] || 0) - (order[a.importance] || 0);
    });

    const getAssigneeName = (id: string) => {
        const c = collaborators.find(c => c.collaboratorId === id);
        return c ? c.name : 'Unknown';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-jakarta font-bold text-on-surface">Project Tasks</h2>
                    <p className="text-sm text-on-surface-variant mt-1">Assign and track project milestones</p>
                </div>
                {isOwner && (
                    <Button variant="primary" onClick={() => { setIsAddingTask(true); setAddDateError(''); }}>
                        + Add Task
                    </Button>
                )}
            </div>

            {/* Task List */}
            <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
                {sortedTasks.length > 0 ? (
                    <div className="divide-y divide-surface-container-high">
                        {sortedTasks.map(task => (
                            <div key={task.id} className="p-4 hover:bg-surface-container-low transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-jakarta font-semibold text-on-surface">{task.description}</p>
                                            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-container-high ${importanceColors[task.importance]}`}>
                                                {task.importance}
                                            </span>
                                        </div>
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
                                        {(isOwner || task.assigneeId === currentUserId) ? (
                                            <select
                                                value={task.status}
                                                onChange={e => handleStatusChange(task.id, e.target.value as ProjectTask['status'])}
                                                className={`text-xs font-jakarta font-semibold px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${statusColors[task.status]}`}
                                            >
                                                <option value="pending" className="bg-surface-container-lowest text-on-surface">Pending</option>
                                                <option value="post-poned" className="bg-surface-container-lowest text-on-surface">Post-poned</option>
                                                <option value="completed" className="bg-surface-container-lowest text-on-surface">Completed</option>
                                            </select>
                                        ) : (
                                            <span className={`text-xs font-jakarta font-semibold px-3 py-1.5 rounded-full ${statusColors[task.status]}`}>
                                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                            </span>
                                        )}

                                        <div className="flex items-center gap-1">
                                            {isInstructor && (
                                                <button
                                                    onClick={() => { setFeedbackTaskId(task.id); setFeedbackTaskTitle(task.description); }}
                                                    className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                                    title="Add feedback"
                                                >
                                                    <span className="material-symbols-outlined text-xl">comment</span>
                                                </button>
                                            )}
                                            {isOwner && (
                                                <>
                                                    <button
                                                        onClick={() => openEdit(task)}
                                                        className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
                                                        title="Edit task"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(task.id)}
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
                                        {getTaskFeedback(task.id).map(fb => (
                                            <div key={fb.id} className="bg-primary/5 rounded-lg p-3 relative group">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-xs font-jakarta font-bold text-primary mb-1">
                                                        {fb.instructorName} • {new Date(fb.createdAt).toLocaleDateString()}
                                                    </p>
                                                    {isInstructor && fb.instructorId === currentUserId && (
                                                        <button
                                                            onClick={() => removeTaskFeedback(fb.id)}
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
                        <p className="text-sm text-on-surface-variant mt-1">Start by adding project tasks and assigning them to team members.</p>
                    </div>
                )}
            </div>

            {/* ── Add Task Modal ─────────────────────────────────────────────────── */}
            {isAddingTask && (
                <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg shadow-floating border border-surface-container-high">
                        <h2 className="text-2xl font-jakarta font-bold text-on-surface mb-6">Add New Task</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">Task Description</label>
                                <input
                                    type="text"
                                    value={taskForm.description}
                                    onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                                    placeholder="e.g., Implement login form"
                                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">Assignee</label>
                                <select
                                    value={taskForm.assigneeId}
                                    onChange={e => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Select a collaborator</option>
                                    {collaborators.map(c => (
                                        <option key={c.collaboratorId} value={c.collaboratorId}>{c.name} ({c.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">Importance</label>
                                    <select
                                        value={taskForm.importance}
                                        onChange={e => setTaskForm({ ...taskForm, importance: e.target.value as ProjectTask['importance'] })}
                                        className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">Deadline</label>
                                    <input
                                        type="date"
                                        min={todayStr}
                                        value={taskForm.deadline}
                                        onChange={e => { setTaskForm({ ...taskForm, deadline: e.target.value }); setAddDateError(''); }}
                                        className={`w-full bg-surface-container-low border rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${addDateError ? 'border-error' : 'border-surface-container-high'}`}
                                    />
                                    {addDateError && (
                                        <p className="mt-1 text-xs font-lexend text-error flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">error</span>
                                            {addDateError}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-8">
                            <Button variant="outline" onClick={() => { setIsAddingTask(false); setAddDateError(''); }}>Cancel</Button>
                            <Button
                                variant="primary"
                                onClick={handleAddTask}
                                disabled={!taskForm.description || !taskForm.assigneeId || !taskForm.deadline}
                            >
                                Create Task
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit Task Modal ────────────────────────────────────────────────── */}
            {editingTaskId && editDraft && (
                <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg shadow-floating border border-surface-container-high">
                        <h2 className="text-2xl font-jakarta font-bold text-on-surface mb-6">Edit Task</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">Task Description</label>
                                <input
                                    type="text"
                                    value={editDraft.description}
                                    onChange={e => setEditDraft({ ...editDraft, description: e.target.value })}
                                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">Assignee</label>
                                <select
                                    value={editDraft.assigneeId}
                                    onChange={e => setEditDraft({ ...editDraft, assigneeId: e.target.value })}
                                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Select a collaborator</option>
                                    {collaborators.map(c => (
                                        <option key={c.collaboratorId} value={c.collaboratorId}>{c.name} ({c.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">Importance</label>
                                    <select
                                        value={editDraft.importance}
                                        onChange={e => setEditDraft({ ...editDraft, importance: e.target.value as ProjectTask['importance'] })}
                                        className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">Deadline</label>
                                    <input
                                        type="date"
                                        min={todayStr}
                                        value={editDraft.deadline}
                                        onChange={e => { setEditDraft({ ...editDraft, deadline: e.target.value }); setEditDateError(''); }}
                                        className={`w-full bg-surface-container-low border rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${editDateError ? 'border-error' : 'border-surface-container-high'}`}
                                    />
                                    {editDateError && (
                                        <p className="mt-1 text-xs font-lexend text-error flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">error</span>
                                            {editDateError}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-8">
                            <Button variant="outline" onClick={() => { setEditingTaskId(null); setEditDraft(null); setEditDateError(''); }}>Cancel</Button>
                            <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Dialog ──────────────────────────────────────────── */}
            <ConfirmDialog
                isOpen={confirmDeleteId !== null}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={() => {
                    if (confirmDeleteId) onTasksChange(tasks.filter(t => t.id !== confirmDeleteId));
                    setConfirmDeleteId(null);
                }}
                onCancel={() => setConfirmDeleteId(null)}
            />

            {/* ── Task Feedback Modal ────────────────────────────────────────────── */}
            <TaskFeedbackForm
                projectId={projectId}
                taskId={feedbackTaskId || ''}
                taskTitle={feedbackTaskTitle}
                instructorId={currentUserId}
                instructorName={userName}
                isOpen={!!feedbackTaskId}
                onClose={() => setFeedbackTaskId(null)}
                onFeedbackSubmitted={() => {
                    const notificationBody = `${userName} left feedback on task: "${feedbackTaskTitle}"`;
                    projectMemberIds.forEach(id => addNotification({ type: 'feedback', title: 'New Task Feedback', body: notificationBody, recipientId: id }));
                    setFeedbackTaskId(null);
                }}
            />
        </div>
    );
}
