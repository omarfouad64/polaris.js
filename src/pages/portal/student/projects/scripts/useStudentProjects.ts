import { useState, useEffect, useCallback } from 'react';

export interface ThesisDraft {
  id: string;
  name: string;
  uploadDate: string;
  isFinal: boolean;
}

export interface ProjectTask {
  id: string;
  description: string;
  assigneeId: string;
  status: 'pending' | 'post-poned' | 'completed';
  importance: 'High' | 'Medium' | 'Low';
  deadline: string;
}

export interface ProjectData {
  id: string;
  title: string;
  course: string;
  githubLink: string;
  projectReport: string;
  languages: string[];
  demoVideoUrl?: string;
  thesisDrafts: ThesisDraft[];
  tasks: ProjectTask[];
  createdDate: string;
  updatedDate: string;
  isPublic: boolean;
  status: 'active' | 'flagged';
  flagReason?: string;
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const DUMMY_PROJECTS: ProjectData[] = [
  {
    id: 'proj-001',
    title: 'E-Commerce Platform',
    course: 'course-002',
    githubLink: 'https://github.com/student/ecommerce',
    projectReport: 'Built a full-stack e-commerce platform with React frontend and Node.js backend. Implemented shopping cart, payment integration, and admin dashboard.',
    languages: ['TypeScript', 'React', 'Node.js', 'MongoDB'],
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thesisDrafts: [],
    tasks: [
      { id: 'task-1', description: 'Setup database schema', assigneeId: 'u-student-001', status: 'completed', importance: 'High', deadline: '2026-01-20' },
      { id: 'task-2', description: 'Implement authentication', assigneeId: 'u-student-001', status: 'pending', importance: 'Medium', deadline: '2026-02-15' },
      { id: 'task-3', description: 'Add unit tests', assigneeId: 'u-student-001', status: 'pending', importance: 'Low', deadline: '2026-03-01' },
    ],
    createdDate: '2026-01-15',
    updatedDate: '2026-02-10',
    isPublic: true,
    status: 'active',
  },
  {
    id: 'proj-002',
    title: 'Machine Learning Classification',
    course: 'course-001',
    githubLink: 'https://github.com/student/ml-classifier',
    projectReport: 'Developed a machine learning classifier for image recognition using convolutional neural networks. Achieved 94% accuracy on test dataset.',
    languages: ['Python', 'TensorFlow', 'Scikit-learn'],
    demoVideoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    thesisDrafts: [],
    tasks: [],
    createdDate: '2025-09-01',
    updatedDate: '2026-03-20',
    isPublic: true,
    status: 'flagged',
    flagReason: 'Copyrighted material detected in documentation.',
  },
  {
    id: 'proj-003',
    title: 'Mobile Chat App',
    course: 'course-003',
    githubLink: 'https://github.com/student/chat-app',
    projectReport: 'Cross-platform chat application with real-time messaging, user authentication, and push notifications.',
    languages: ['React Native', 'Firebase', 'JavaScript'],
    demoVideoUrl: undefined,
    thesisDrafts: [],
    tasks: [],
    createdDate: '2026-02-01',
    updatedDate: '2026-02-28',
    isPublic: false,
    status: 'active',
  },
];

// ── Shared module-level state ─────────────────────────────────────────────────
// All hook instances share the same array so mutations are immediately visible
// across every component (project list card, project detail page, settings toggle).

const STORAGE_KEY = 'polaris_projects';

type Listener = () => void;
const listeners = new Set<Listener>();

let sharedProjects: ProjectData[] = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProjectData[];
      // Merge: keep saved projects, add any new seeds missing from saved data
      const savedIds = new Set(parsed.map(p => p.id));
      const missing = DUMMY_PROJECTS.filter(p => !savedIds.has(p.id));
      return [...parsed, ...missing];
    }
  } catch { /* ignore */ }
  return [...DUMMY_PROJECTS];
})();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedProjects));
  } catch { /* ignore quota errors */ }
}

function emit() {
  persist();
  listeners.forEach(fn => fn());
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useStudentProjects — Manages student project CRUD with shared module-level state.
 * All instances (project list, detail page, settings panel) share the same data
 * so visibility toggles and edits are immediately consistent everywhere.
 */
export default function useStudentProjects() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const createProject = useCallback((project: Omit<ProjectData, 'id' | 'createdDate' | 'updatedDate'>) => {
    const newProject: ProjectData = {
      ...project,
      id: `proj-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };
    sharedProjects = [newProject, ...sharedProjects];
    emit();
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Omit<ProjectData, 'id' | 'createdDate'>>) => {
    sharedProjects = sharedProjects.map(p =>
      p.id === id
        ? { ...p, ...updates, updatedDate: new Date().toISOString().split('T')[0] }
        : p
    );
    emit();
  }, []);

  const deleteProject = useCallback((id: string) => {
    sharedProjects = sharedProjects.filter(p => p.id !== id);
    emit();
  }, []);

  const getProjectById = useCallback((id: string): ProjectData | undefined => {
    return sharedProjects.find(p => p.id === id);
  }, []);

  return {
    projects: sharedProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    isLoading: false,
  };
}
