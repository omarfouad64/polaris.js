import { useCallback, useMemo } from 'react';
import useDatabase from '../../../../../hooks/useDatabase';
import {
  addProject,
  updateProject as updateProjectAction,
  deleteProject as deleteProjectAction,
} from '../../../../../store/databaseSlice';

export type { ThesisDraft, ProjectTask } from '../../../../../store/initialData';
import type { ThesisDraft, ProjectTask } from '../../../../../store/initialData';

export interface ProjectData {
  id: string;
  ownerId: string;
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

/**
 * useStudentProjects — manages student project CRUD via Redux store.
 * All state is centralized; mutations are immediately visible across every component.
 */
export default function useStudentProjects(ownerId?: string) {
  const { projects: rawProjects, dispatch } = useDatabase();

  // Cast store projects to ProjectData shape and filter by owner if requested
  const projects = useMemo(() => {
    const all = rawProjects as unknown as ProjectData[];
    return ownerId ? all.filter(p => (p as any).ownerId === ownerId) : all;
  }, [rawProjects, ownerId]);

  const createProject = useCallback((project: Omit<ProjectData, 'id' | 'ownerId' | 'createdDate' | 'updatedDate'>) => {
    const newProject: ProjectData = {
      ...project,
      id: `proj-${Date.now()}`,
      ownerId: 'student_1', 
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };
    dispatch(addProject({ ...newProject, courseId: newProject.course, ownerId: 'student_1' }));
    return newProject;
  }, [dispatch]);

  const updateProject = useCallback((id: string, updates: Partial<Omit<ProjectData, 'id' | 'createdDate'>>) => {
    dispatch(updateProjectAction({
      id,
      ...updates,
      updatedDate: new Date().toISOString().split('T')[0],
    }));
  }, [dispatch]);

  const deleteProject = useCallback((id: string) => {
    dispatch(deleteProjectAction(id));
  }, [dispatch]);

  const getProjectById = useCallback((id: string): ProjectData | undefined => {
    return projects.find(p => p.id === id);
  }, [projects]);

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    isLoading: false,
  };
}
