import { useState, useEffect } from 'react';

export interface ThesisDraft {
  id: string;
  name: string;
  uploadDate: string;
  isFinal: boolean;
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
  createdDate: string;
  updatedDate: string;
  isPublic: boolean;
}

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
    createdDate: '2026-01-15',
    updatedDate: '2026-02-10',
    isPublic: true,
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
    createdDate: '2025-09-01',
    updatedDate: '2026-03-20',
    isPublic: true,
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
    createdDate: '2026-02-01',
    updatedDate: '2026-02-28',
    isPublic: false,
  },
];

/**
 * useStudentProjects — Manages student project CRUD operations with dummy data.
 * Data persists during the current session.
 *
 * @returns Project management functions and state.
 */
export default function useStudentProjects() {
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    const saved = localStorage.getItem('polaris_projects');
    return saved ? JSON.parse(saved) : DUMMY_PROJECTS;
  });
  const [isLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('polaris_projects', JSON.stringify(projects));
  }, [projects]);

  const createProject = (project: Omit<ProjectData, 'id' | 'createdDate' | 'updatedDate'>) => {
    const newProject: ProjectData = {
      ...project,
      id: `proj-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Omit<ProjectData, 'id' | 'createdDate'>>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              updatedDate: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const getProjectById = (id: string): ProjectData | undefined => {
    return projects.find((p) => p.id === id);
  };

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    isLoading,
  };
}
